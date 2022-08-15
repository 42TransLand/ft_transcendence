import React from 'react';
import { useNavigate } from 'react-router-dom';
import useWarningDialog from './useWarningDialog';
import { useSocket } from './useSocket';
import InviteGameProps from '../Props/InviteGameProps';
import GameTicket from '../Games/dto/constants/game.ticket.enum';

export default function useInviteGame(inviteeNickname: string) {
  const { setError, WarningDialogComponent } = useWarningDialog();
  const navigate = useNavigate();
  const socket = useSocket();
  const onSubmit = React.useCallback(
    (values: InviteGameProps) => {
      socket.dispatch({
        action: 'setCustomGame',
        gameState: {
          ticket: GameTicket.CREATE,
          gameMode: values.mode,
          scoreForWin: values.scoreForWin,
          opponentNickname: inviteeNickname,
        },
      });
      navigate(`/game?mode=custom`);
    },
    [socket, inviteeNickname, navigate],
  );
  return { onSubmit, setError, WarningDialogComponent };
}
