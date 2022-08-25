import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormikHelpers } from 'formik';
import axios from 'axios';
import useMe from '../../../Hooks/useMe';
import useMessage from '../../../Hooks/useMessage';
import ChatModal from '../ChatModal';
import useChatNotify from '../../../Hooks/useChatNotify';
import useChatRoomInfo from '../../../Hooks/useChatRoomInfo';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import ChatUserProps from '../../../Props/ChatUserProps';

export default function ChatMessageContent() {
  const { dispatchChat, insertRoomMember } = useMessage();
  const { nickname } = useMe();
  const { id } = useParams();
  const chatRoomId = id ?? '';
  useChatRoomInfo();
  useChatNotify();

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
  }, [insertRoomMember, chatRoomId]);

  // send
  const { setError, WarningDialogComponent } = useWarningDialog();
  const onSubmitHandler = useCallback(
    (
      values: { message: string },
      helper: FormikHelpers<{ message: string }>,
    ) => {
      const { message } = values;
      if (message.length === 0) {
        helper.setSubmitting(false);
        return;
      }
      axios
        .post(`/chat/send/${chatRoomId}`, { content: message })
        .then(() => {
          dispatchChat(nickname, message);
        })
        .catch(setError);
      helper.resetForm();
      helper.setSubmitting(false);
    },
    [chatRoomId, dispatchChat, nickname, setError],
  );

  // default error
  useEffect(() => {
    if (!chatRoomId)
      setError({
        headerMessage: '채팅 입장 실패',
        bodyMessage: '잘못된 접근 입니다.',
      });
  }, [chatRoomId, setError]);

  return (
    <>
      <ChatModal onSubmitHandler={onSubmitHandler} />
      {WarningDialogComponent}
    </>
  );
}
