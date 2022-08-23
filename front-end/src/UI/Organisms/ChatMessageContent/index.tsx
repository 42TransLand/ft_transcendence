import React, { useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { FormikHelpers } from 'formik';
import axios from 'axios';
import useMe from '../../../Hooks/useMe';
import useMessage from '../../../Hooks/useMessage';
import { useSocket } from '../../../Hooks/useSocket';
import CHAT_USERS_GET from '../../../Queries/ChatUsers/All';
import SocketEventName from '../../../WebSockets/dto/constants/socket.events.enum';
import ChatLeaveNotifyProps from '../../../WebSockets/dto/res/chat.leave.notify.dto';
import ChatMessageProps from '../../../WebSockets/dto/res/chat.message.notify.dto';
import ChatUserProps from '../../../Props/ChatUserProps';
import ROOM_GET from '../../../Queries/Channels/Room';
import ChatUpdateProtectionNotifyProps from '../../../WebSockets/dto/res/chat.update.protection.notify.dto';
import ChannelType from '../../../Props/ChannelType';
import WarningDialogProps from '../../../Props/WarningDialogProps';
import ChatModal from '../ChatModal';
import ChatMemberRole from '../../../Props/ChatMemberRole';
import ChatJoinNotifyProps from '../../../WebSockets/dto/res/chat.join.notify.dto';

export default function ChatMessageContent({
  setError,
}: {
  setError: (props: WarningDialogProps) => void;
}) {
  const {
    dispatchRoomInfo,
    dispatchChat,
    insertRoomMember,
    deleteRoomMember,
    dispatchRoomProtection,
  } = useMessage();
  const { nickname } = useMe();
  const { id } = useParams();
  const chatRoomId = id ?? '';
  const { state } = useSocket();
  const queryClient = useQueryClient();
  const onSubmitHandler = useCallback(
    (
      values: { message: string },
      helper: FormikHelpers<{ message: string }>,
    ) => {
      const { message } = values;
      if (message.length === 0) return;
      axios
        .post(`/chat/send/${chatRoomId}`, { content: message })
        .then(() => {
          dispatchChat(nickname, message);
          helper.resetForm();
        })
        .catch((err) => {
          if (err.response) {
            setError({
              headerMessage: '오류 발생',
              bodyMessage: err.response.data.message,
            });
          } else {
            setError({
              headerMessage: '오류 발생',
              bodyMessage: err.message,
            });
          }
        });
    },
    [chatRoomId, dispatchChat, nickname, setError],
  );
  useEffect(
    () => () => {
      if (chatRoomId === '') return;
      axios
        .delete(`/chat/leave/${chatRoomId}`)
        .then(() => queryClient.invalidateQueries(['channels']))
        .catch((err) => {
          if (err.response) {
            setError({
              headerMessage: '오류 발생',
              bodyMessage: err.response.data.message,
            });
          } else {
            setError({
              headerMessage: '오류 발생',
              bodyMessage: err.message,
            });
          }
        });
    },
    [chatRoomId, queryClient, setError],
  );
  const { isLoading, error, data } = useQuery(CHAT_USERS_GET(chatRoomId));
  const {
    error: roomInfoError,
    isLoading: roomInfoLoading,
    data: roomData,
  } = useQuery(ROOM_GET(chatRoomId));

  useEffect(() => {
    dispatchRoomInfo({
      roomType: roomData?.type ?? ChannelType.PUBLIC,
      channelName: roomData?.name ?? '',
    });
  }, [dispatchRoomInfo, roomData]);
  useEffect(() => {
    axios
      .get(`/chat/users/${chatRoomId}`)
      .then((response: { data: ChatUserProps[] }) => {
        const result = response.data;
        result.forEach((member) => {
          insertRoomMember({
            userId: member.user.id,
            name: member.user.nickname,
            profileImg: `${process.env.REACT_APP_API_HOST}/${member.user.profileImg}`,
            role: member.role,
            muted: false,
            blocked: false,
          });
        });
      });
  }, [insertRoomMember, chatRoomId, nickname]);

  useEffect(() => {
    if (isLoading || roomInfoLoading) return;
    if (!chatRoomId) {
      setError({
        headerMessage: '오류 발생',
        bodyMessage: '정상적인 접근이 아닙니다.',
      });
    } else if (error || roomInfoError) {
      setError({
        headerMessage: '오류 발생',
        bodyMessage: error
          ? error.message
          : roomInfoError?.message ?? '알 수 없는 오류입니다.',
      });
    }
  }, [chatRoomId, error, isLoading, roomInfoLoading, roomInfoError, setError]);

  useEffect(() => {
    state.socket?.on(
      SocketEventName.CHAT_JOIN_NOTIFY,
      (dto: ChatJoinNotifyProps) => {
        insertRoomMember({
          profileImg: `${process.env.REACT_APP_API_HOST}/${dto.profileImg}`,
          userId: dto.id,
          name: dto.nickname,
          role: ChatMemberRole.MEMBER,
          muted: false,
          blocked: false,
        });
        if (dto.nickname === nickname) {
          data
            ?.filter((m) => m.user.nickname !== nickname)
            .forEach((member) => {
              insertRoomMember({
                userId: member.user.id,
                name: member.user.nickname,
                profileImg: `${process.env.REACT_APP_API_HOST}/${member.user.profileImg}`,
                role: member.role,
                muted: false,
                blocked: false,
              });
            });
        }
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_LEAVE_NOTIFY,
      (dto: ChatLeaveNotifyProps) => {
        deleteRoomMember(dto.nickname);
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_MESSAGE_NOTIFY,
      (dto: ChatMessageProps) => {
        if (dto.nickname !== nickname) {
          dispatchChat(dto.nickname, dto.content);
        }
      },
    );
    state.socket?.on(
      SocketEventName.CHAT_UPDATE_PROTECTION_NOTIFY,
      (dto: ChatUpdateProtectionNotifyProps) => {
        dispatchRoomProtection(
          dto.status ? ChannelType.PUBLIC : ChannelType.PROTECT,
        );
      },
    );
    return () => {
      state.socket?.off(SocketEventName.CHAT_JOIN_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_LEAVE_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_MESSAGE_NOTIFY);
      state.socket?.off(SocketEventName.CHAT_UPDATE_PROTECTION_NOTIFY);
    };
  }, [
    data,
    nickname,
    state.socket,
    insertRoomMember,
    deleteRoomMember,
    dispatchChat,
    dispatchRoomInfo,
    dispatchRoomProtection,
  ]);

  return <ChatModal onSubmitHandler={onSubmitHandler} />;
}
