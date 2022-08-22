import React from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import ChatMessageContent from '../../Organisms/ChatMessageContent';
import useMe from '../../../Hooks/useMe';

export default function ChatMessage() {
  const { id } = useParams();
  const roomId = React.useMemo(() => id ?? '', [id]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setError, WarningDialogComponent } = useWarningDialog(() => {
    navigate(-1);
  });
  const [isSuccess, setSuccess] = React.useState(false);
  const { id: myId } = useMe();

  const password = React.useMemo(() => {
    const localPassword = localStorage.getItem(roomId);
    if (localPassword) return { password: localPassword };
    return undefined;
  }, [roomId]);
  React.useEffect(() => {
    if (!roomId) {
      setError({
        headerMessage: '채팅 입장 실패',
        bodyMessage: '잘못된 접근 입니다.',
      });
      return;
    }
    axios
      .post(`/chat/join/${roomId}`, password)
      .then(() => {
        queryClient.invalidateQueries(['channels']);
        setSuccess(true);
      })
      .catch((err) => {
        if (err.response) {
          setError({
            headerMessage: '채팅 입장 실패',
            bodyMessage: err.response.data.message,
          });
        } else {
          setError({
            headerMessage: '채팅 입장 실패',
            bodyMessage: err.message,
          });
        }
      });
  }, [roomId, navigate, password, queryClient, setError, setSuccess, myId]);

  return (
    <>
      {isSuccess && <ChatMessageContent setError={setError} />}
      {WarningDialogComponent}
    </>
  );
}
