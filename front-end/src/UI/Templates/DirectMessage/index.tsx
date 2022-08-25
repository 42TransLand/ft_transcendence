import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FormikHelpers } from 'formik';
import axios from 'axios';
import useMe from '../../../Hooks/useMe';
import useMessage from '../../../Hooks/useMessage';
import ChatModal from '../../Organisms/ChatModal';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import USERS_PROFILE_GET from '../../../Queries/Users/Profile';
import ChatMemberRole from '../../../Props/ChatMemberRole';
import { useSocket } from '../../../Hooks/useSocket';
import SocketEventName from '../../../WebSockets/dto/constants/socket.events.enum';
import ChatMessageProps from '../../../WebSockets/dto/res/chat.message.notify.dto';

export default function DirectMessage() {
  const { dispatchRoomInfo, dispatchChat, displayDMHistory, insertRoomMember } =
    useMessage();
  const navigate = useNavigate();
  const { nickname } = useMe();
  const { userName } = useParams();
  const targetName: string = userName ?? '';
  const { isLoading, error, data } = useQuery(USERS_PROFILE_GET(targetName));
  const { setError, WarningDialogComponent } = useWarningDialog(() =>
    navigate(-1),
  );
  const { state } = useSocket();

  const onSubmitHandler = useCallback(
    (
      values: { message: string },
      helper: FormikHelpers<{ message: string }>,
    ) => {
      const { message } = values;
      if (message.length === 0) return;
      axios.post(`/dm/send/${targetName}`, { content: message }).then(() => {
        dispatchChat(nickname, message);
      });
      helper.resetForm();
    },
    [dispatchChat, nickname, targetName],
  );

  useEffect(() => {
    if (isLoading) return;
    if (!targetName || error) {
      setError({
        headerMessage: '오류 발생',
        bodyMessage: error
          ? '서버와의 통신에 실패했습니다.'
          : '정상적인 접근이 아닙니다.',
      });
      return;
    }
    state.socket?.on(
      SocketEventName.CHAT_MESSAGE_NOTIFY,
      (dto: ChatMessageProps) => {
        if (dto.nickname === targetName) {
          dispatchChat(dto.nickname, dto.content);
        }
      },
    );
    dispatchRoomInfo({
      roomType: 'private',
      channelName: targetName,
    });
    insertRoomMember({
      userId: data.id,
      name: data.nickname,
      profileImg: `${process.env.REACT_APP_API_HOST}/${data.profileImg}`,
      role: ChatMemberRole.MEMBER,
      muted: false,
      blocked: false,
    });
    displayDMHistory(targetName);
  }, [
    state.socket,
    dispatchChat,
    isLoading,
    error,
    dispatchRoomInfo,
    targetName,
    setError,
    insertRoomMember,
    displayDMHistory,
    data,
  ]);

  return (
    <>
      <ChatModal onSubmitHandler={onSubmitHandler} />
      {WarningDialogComponent}
    </>
  );
}
