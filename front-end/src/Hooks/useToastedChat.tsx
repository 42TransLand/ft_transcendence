import React from 'react';
import { useToast } from '@chakra-ui/react';
import { useChat } from './useChat';

export default function useToastedChat(selfName: string) {
  const [state, dispatch] = useChat();
  const toast = useToast();
  const isSelf = React.useCallback(
    (target: string): boolean => selfName === target,
    [selfName],
  );
  React.useEffect(() => {
    const events = state.events.slice();
    dispatch({ action: 'clearEvents' });
    events.forEach((event) => {
      let type: 'success' | 'error' | 'info' | 'warning' = 'info';
      let action;
      switch (event.type) {
        case 'adminApproved':
          action = '채팅방 관리자로 임명';
          break;
        case 'adminUnapproved':
          action = '채팅방 관리자로 임명';
          break;
        case 'banned':
          action = '채팅방에서 영구추방';
          type = 'error';
          break;
        case 'muted':
          action = '채팅방에서 음소거';
          type = 'warning';
          break;
        case 'unmuted':
          action = '채팅방에서 음소거 해제';
          type = 'warning';
          break;
        case 'ownerSucceeded':
          action = '채팅방의 방장이 ';
          break;
        default:
          action = event.type;
          break;
      }
      if (event.commandSuccessful !== undefined) {
        type = event.commandSuccessful ? 'success' : 'error';
        toast({
          title: `${event.target}님을 ${action} ${
            event.commandSuccessful ? '했습니다' : '하지 못했습니다'
          }.`,
          status: type,
          isClosable: true,
          position: 'top',
        });
      } else {
        const targetPrefix = isSelf(event.target)
          ? '당신은'
          : `${event.target}님께서`;
        const actionSuffix = isSelf(event.target) ? '되었습니다' : '되셨습니다';
        toast({
          title: `${targetPrefix} ${action} ${actionSuffix}.`,
          status: type,
          isClosable: true,
          position: 'top',
        });
      }
    });
  }, [state, dispatch, isSelf, toast]);
}
