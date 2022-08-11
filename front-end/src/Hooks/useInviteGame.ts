import React from 'react';
import { useNavigate } from 'react-router-dom';
import useWarningDialog from './useWarningDialog';
import { useSocket } from './useSocket';
import InviteGameProps from '../Props/InviteGameProps';

export default function useInviteGame(inviteeNickname: string) {
  const { setError, WarningDialogComponent } = useWarningDialog();
  const navigate = useNavigate();
  const socket = useSocket();
  const onSubmit = React.useCallback(
    (values: InviteGameProps) => {
      socket.dispatch({
        action: 'setCustomGame',
        gameState: {
          mode: 'create',
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
