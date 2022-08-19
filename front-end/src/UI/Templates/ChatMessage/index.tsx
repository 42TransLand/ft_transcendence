/* eslint-disable*/
import React, { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { FormikHelpers } from 'formik';
import axios from 'axios';
import useMe from '../../../Hooks/useMe';
import useMessage from '../../../Hooks/useMessage';
import { useSocket } from '../../../Hooks/useSocket';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import CHAT_USERS_GET from '../../../Queries/ChatUsers/All';
import ChatModal from '../../Organisms/ChatModal';

export default function ChatMessage() {
  const { dispatchRoomInfo, dispatchChat, displayDMHistory, insertRoomMember } =
    useMessage();
  const navigate = useNavigate();
  const { nickname } = useMe();
  const { id } = useParams();
  const chatRoomId = id ?? '';
  const { isLoading, error, data } = useQuery(CHAT_USERS_GET(chatRoomId));
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

  useEffect(() => {
    if (isLoading) return;
    if (!chatRoomId || error) {
      setError({
        headerMessage: '오류 발생',
        bodyMessage: error
          ? '서버와의 통신에 실패했습니다.'
          : '정상적인 접근이 아닙니다.',
      });
      return;
    }
    // axios.post();
    // state.socket?.on(
    //   SocketEventName.CHAT_MESSAGE_NOTIFY,
    //   (dto: ChatMessageProps) => {
    //     if (dto.chatRoomId === chatRoomId) {
    //       dispatchChat(dto.nickname, dto.content);
    //     }
    //   },
    // );
  });
  return (
    <>
      <ChatModal onSubmitHandler={onSubmitHandler} />
      {WarningDialogComponent}
    </>
  );
}
