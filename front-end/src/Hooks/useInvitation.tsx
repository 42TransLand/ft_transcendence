import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast, ToastId } from '@chakra-ui/react';
import GameInvitationContent from '../UI/Molecules/GameInvitationContent';
import { SocketEventName } from '../Games/dto/constants/game.constants';
import { useSocket } from './useSocket';
import GameTicket from '../Games/dto/constants/game.ticket.enum';

export default function useInvitation() {
  const [invitations, setInvitations] = useState<ToastId[]>([]);
  const navigate = useNavigate();
  const { state, dispatch } = useSocket();
  const toast = useToast();

  const handleInvitation = React.useCallback(
    (toastId: string, response: boolean, userName: string) => {
      if (response) {
        toast.closeAll();
        setInvitations([]);
        dispatch({
          action: 'setCustomGame',
          gameState: { ticket: GameTicket.JOIN, opponentNickname: userName },
        });
        navigate('/game?mode=custom');
      } else {
        toast.close(toastId);
        setInvitations(invitations.filter((id) => id !== toastId));
        state.socket?.emit(SocketEventName.GAME_REFUSE_REQ, {
          opponentNickname: userName,
        });
      }
    },
    [invitations, toast, dispatch, navigate, state.socket],
  );

  const newInvitation = (
    userName: string,
    gameMode: string,
    scoreForWin: number,
    isRanked: boolean,
  ) => {
    setInvitations([
      ...invitations,
      toast({
        position: 'bottom-left',
        duration: null,
        id: userName,
        render: () => (
          <GameInvitationContent
            userName={userName}
            gameMode={gameMode}
            isRanked={isRanked}
            scoreForWin={scoreForWin}
            handleInvitation={handleInvitation}
          />
        ),
      }),
    ]);
  };
  return newInvitation;
}
