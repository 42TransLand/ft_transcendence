import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FormikHelpers } from 'formik';
import axios, { AxiosError } from 'axios';
import useMe from '../../../Hooks/useMe';
import useMessage from '../../../Hooks/useMessage';
import WarningDialogProps from '../../../Props/WarningDialogProps';
import ChatModal from '../ChatModal';
import useChatNotify from '../../../Hooks/useChatNotify';
import useChatRoomInfo from '../../../Hooks/useChatRoomInfo';
import CHAT_USERS_GET from '../../../Queries/ChatUsers/All';

export default function ChatMessageContent({
  setError,
}: {
  setError: (props: WarningDialogProps | AxiosError<any, any>) => void;
}) {
  const { dispatchChat, insertRoomMember } = useMessage();
  const { nickname } = useMe();
  const { id } = useParams();
  const chatRoomId = id ?? '';
  useChatRoomInfo();
  useChatNotify();

  // user info fetch (only once)
  const { isLoading, data, error } = useQuery(CHAT_USERS_GET(chatRoomId, true));
  useEffect(() => {
    if (isLoading || error) return;
    data.forEach((member) => {
      insertRoomMember({
        userId: member.user.id,
        name: member.user.nickname,
        profileImg: `${process.env.REACT_APP_API_HOST}/${member.user.profileImg}`,
        role: member.role,
        muted: false,
        blocked: false,
      });
    });
  }, [insertRoomMember, data, isLoading, error]);

  // send
  const onSubmitHandler = useCallback(
    (
      values: { message: string },
      helper: FormikHelpers<{ message: string }>,
    ) => {
      const { message } = values;
      if (message.length === 0) return;
      if (isLoading || error) return;
      axios
        .post(`/chat/send/${chatRoomId}`, { content: message })
        .then(() => {
          dispatchChat(nickname, message);
          helper.resetForm();
        })
        .catch(setError);
    },
    [chatRoomId, dispatchChat, error, isLoading, nickname, setError],
  );

  // default error
  useEffect(() => {
    if (!chatRoomId)
      setError({
        headerMessage: '채팅 입장 실패',
        bodyMessage: '잘못된 접근 입니다.',
      });
  }, [chatRoomId, setError]);

  return <ChatModal onSubmitHandler={onSubmitHandler} />;
}
