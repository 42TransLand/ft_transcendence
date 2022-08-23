import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useSocket } from './useSocket';
import DirectMessageToastContent from '../UI/Molecules/DirectMessageToastContent';
import ChatMessageProps from '../WebSockets/dto/res/chat.message.notify.dto';
import SocketEventName from '../WebSockets/dto/constants/socket.events.enum';

const DirectMessageContext = React.createContext<
  [string, React.Dispatch<React.SetStateAction<string>>] | null
>(null);

export function useDirectMessage() {
  const context = React.useContext(DirectMessageContext);
  if (!context) {
    throw new Error(
      'useDirectMessage must be used within a DirectMessageProvider',
    );
  }
  return context;
}

export function DirectMessageProvider({
  children,
}: {
  children: JSX.Element | null;
}) {
  const [targetName, setTargetName] = React.useState('');
  const { state } = useSocket();
  const toast = useToast();
  const callNotify = React.useCallback(
    (userName: string, content: string) =>
      toast({
        position: 'top-left',
        isClosable: true,
        render: ({ onClose }) => (
          <DirectMessageToastContent
            userName={userName}
            content={content}
            onClose={onClose}
          />
        ),
      }),
    [toast],
  );
  const onChatMessageNotify = React.useCallback(
    (dto: ChatMessageProps) => {
      if (dto.nickname === targetName) return;
      callNotify(dto.nickname, dto.content);
    },
    [callNotify, targetName],
  );
  React.useEffect(() => {
    state.socket?.on(SocketEventName.CHAT_MESSAGE_NOTIFY, onChatMessageNotify);
    return () => {
      state.socket?.off(
        SocketEventName.CHAT_MESSAGE_NOTIFY,
        onChatMessageNotify,
      );
    };
  }, [onChatMessageNotify, state.socket]);
  const val = React.useMemo(
    (): [string, React.Dispatch<React.SetStateAction<string>>] => [
      targetName,
      setTargetName,
    ],
    [targetName, setTargetName],
  );

  return (
    <DirectMessageContext.Provider value={val}>
      {children}
    </DirectMessageContext.Provider>
  );
}
