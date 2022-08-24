import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import ChatMessageContent from '../../Organisms/ChatMessageContent';
import {
  ChatStateRequestType,
  useChatState,
} from '../../../Hooks/useChatState';
import CHANNEL_JOIN from '../../../Queries/Channels/Join';
import { SocketState, useSocket } from '../../../Hooks/useSocket';

export default function ChatMessage() {
  const { id } = useParams();
  const roomId = React.useMemo(() => id ?? '', [id]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setError, WarningDialogComponent } = useWarningDialog(() => {
    navigate(-1);
  });
  const { state } = useSocket();
  const [isSuccess, setSuccess] = React.useState(false);
  const { request, setRequest } = useChatState();

  const mutation = useMutation(
    CHANNEL_JOIN(
      roomId,
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['channels']);
          setSuccess(true);
          setRequest({ type: ChatStateRequestType.JOIN });
        },
        onError: setError,
        retry: 10,
        retryDelay: 100,
      },
      request?.password,
    ),
  );

  React.useEffect(() => {
    if (!roomId) {
      setError({
        headerMessage: '채팅 입장 실패',
        bodyMessage: '잘못된 접근 입니다.',
      });
    }
    if (state.socketState !== SocketState.CONNECTED) return;
    if (isSuccess) return;
    if (request?.type === ChatStateRequestType.JOIN) {
      mutation.mutate();
    } else {
      queryClient.invalidateQueries(['channels']);
      setSuccess(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    request,
    roomId,
    setError,
    setSuccess,
    queryClient,
    state.socketState,
    isSuccess,
  ]);

  return (
    <>
      {isSuccess && <ChatMessageContent />}
      {WarningDialogComponent}
    </>
  );
}
