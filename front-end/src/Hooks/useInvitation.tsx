import React, { useState } from 'react';
import { useToast, ToastId } from '@chakra-ui/react';
import GameInvitationContent from '../UI/Molecules/GameInvitationContent';

export default function useInvitation() {
  const [invitations, setInvitations] = useState<ToastId[]>([]);
  const toast = useToast();

  const handleInvitation = React.useCallback(
    (toastId: number, response: boolean, AcceptanceCallback: () => void) => {
      if (response) {
        toast.closeAll();
        setInvitations([]);
        AcceptanceCallback();
      } else {
        toast.close(toastId);
        setInvitations(invitations.filter((id) => id !== toastId));
      }
    },
    [invitations, toast],
  );
  const newInvitation = (
    userName: string,
    gameId: number,
    gameMode: string,
    isRanked: boolean,
  ) => {
    setInvitations([
      ...invitations,
      toast({
        position: 'bottom-left',
        duration: null,
        id: gameId,
        render: () => (
          <GameInvitationContent
            userName={userName}
            gameId={gameId}
            gameMode={gameMode}
            isRanked={isRanked}
            handleInvitation={handleInvitation}
          />
        ),
      }),
    ]);
  };
  return newInvitation;
}
