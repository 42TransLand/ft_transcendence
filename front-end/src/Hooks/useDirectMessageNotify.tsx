import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useSocket } from './useSocket';
import DirectMessageToastContent from '../UI/Molecules/DirectMessageToastContent';
import ChatMessageProps from '../WebSockets/dto/res/chat.message.notify.dto';
import SocketEventName from '../WebSockets/dto/constants/socket.events.enum';

const DirectMessageTargetContext = React.createContext<
  [string, React.Dispatch<React.SetStateAction<string>>] | null
>(null);

export function useDirectMessageTarget() {
  const context = React.useContext(DirectMessageTargetContext);
  if (!context) {
    throw new Error(
      'useDirectMessageTarget must be used within a DirectMessageTargetProvider',
    );
  }
  return context;
}

export function DirectMessageTargetProvider({
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
    <DirectMessageTargetContext.Provider value={val}>
      {children}
    </DirectMessageTargetContext.Provider>
  );
}
