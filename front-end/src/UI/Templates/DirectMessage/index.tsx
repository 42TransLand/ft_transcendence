import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FormikHelpers } from 'formik';
import axios, { AxiosError } from 'axios';
import useMe from '../../../Hooks/useMe';
import useMessage from '../../../Hooks/useMessage';
import ChatModal from '../../Organisms/ChatModal';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import USERS_PROFILE_GET from '../../../Queries/Users/Profile';
import ChatMemberRole from '../../../Props/ChatMemberRole';
import { useSocket } from '../../../Hooks/useSocket';
import SocketEventName from '../../../WebSockets/dto/constants/socket.events.enum';
import ChatMessageProps from '../../../WebSockets/dto/res/chat.message.notify.dto';
import { useDirectMessage } from '../../../Hooks/useDirectMessageNotify';
import ChannelType from '../../../Props/ChannelType';

export default function DirectMessage() {
  const { dispatchRoomInfo, dispatchChat, displayDMHistory, upsertRoomMember } =
    useMessage();
  const navigate = useNavigate();
  const { setError, WarningDialogComponent } = useWarningDialog(() =>
    navigate(-1),
  );
  const { id: myId, nickname: myName, profileImg: myProfileImg } = useMe();
  const { userName } = useParams();
  const targetName: string = userName ?? '';
  useEffect(() => {
    dispatchRoomInfo({
      roomType: ChannelType.PRIVATE,
      channelName: targetName,
    });
    upsertRoomMember({
      userId: myId,
      name: myName,
      profileImg: `${process.env.REACT_APP_API_HOST}/${myProfileImg}`,
      role: ChatMemberRole.MEMBER,
      muted: false,
      blocked: false,
    });
  }, [
    dispatchRoomInfo,
    myId,
    myName,
    myProfileImg,
    targetName,
    upsertRoomMember,
  ]);
  useQuery({
    ...USERS_PROFILE_GET(targetName),
    onSuccess: (res) => {
      upsertRoomMember({
        userId: res.id,
        name: res.nickname,
        profileImg: `${process.env.REACT_APP_API_HOST}/${res.profileImg}`,
        role: ChatMemberRole.MEMBER,
        muted: false,
        blocked: false,
      });
    },
    onError(err: AxiosError<any, any>) {
      setError({
        headerMessage: '오류 발생',
        bodyMessage: err?.response?.data?.message ?? err.message,
      });
    },
  });
  const { state } = useSocket();

  const onSubmitHandler = useCallback(
    (
      values: { message: string },
      helper: FormikHelpers<{ message: string }>,
    ) => {
      const { message } = values;
      if (message.length === 0) return;
      axios.post(`/dm/send/${targetName}`, { content: message }).then(() => {
        dispatchChat(myName, message);
      });
      helper.resetForm();
    },
    [dispatchChat, myName, targetName],
  );
  const onChatNotify = React.useCallback(
    (dto: ChatMessageProps) => {
      if (dto.nickname === targetName) {
        dispatchChat(dto.nickname, dto.content);
      }
    },
    [dispatchChat, targetName],
  );

  const [, setTargetName] = useDirectMessage();
  useEffect(() => {
    setTargetName(targetName);
    return () => setTargetName('');
  }, [targetName, setTargetName]);
  useEffect(() => {
    displayDMHistory(targetName);
  }, [displayDMHistory, targetName]);
  useEffect(() => {
    state.socket?.on(SocketEventName.CHAT_MESSAGE_NOTIFY, onChatNotify);
    return () => {
      state.socket?.off(SocketEventName.CHAT_MESSAGE_NOTIFY, onChatNotify);
    };
  }, [onChatNotify, state.socket]);

  return (
    <>
      <ChatModal onSubmitHandler={onSubmitHandler} />
      {WarningDialogComponent}
    </>
  );
}
