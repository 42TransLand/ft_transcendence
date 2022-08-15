import React from 'react';
import { SocketEventName } from '../Games/dto/constants/game.constants';
import GameMode from '../Games/dto/constants/game.mode.enum';
import GameMatchDto from '../Games/dto/req/game.match.dto';
import useInvitation from './useInvitation';
import { useSocket } from './useSocket';
import useWarningDialog from './useWarningDialog';

export default function useGameInviteNotify() {
  const invite = useInvitation();
  const { state, dispatch } = useSocket();
  const clearSocketError = React.useCallback(() => {
    dispatch({
      action: 'setSocketError',
      error: { headerMessage: '', bodyMessage: '' },
    });
  }, [dispatch]);
  const { setError, WarningDialogComponent } = useWarningDialog(() => {
    clearSocketError();
  });
  const onInviteNotify = React.useCallback(
    (msg: GameMatchDto & { scoreForWin: number }) => {
      const gameMode =
        msg.gameMode === GameMode.CLASSIC ? '기본모드' : '스피드모드';
      invite(msg.opponentNickname, gameMode, msg.scoreForWin, false);
    },
    [invite],
  );
  React.useEffect(() => {
    if (state.socket) {
      state.socket.on(SocketEventName.GAME_INVITE_NOTIFY, onInviteNotify);
    }
    return () => {
      state.socket?.off(SocketEventName.GAME_INVITE_NOTIFY);
    };
  }, [state.socket, onInviteNotify]);
  React.useEffect(() => {
    if (state.socketError.headerMessage) {
      setError(state.socketError);
    }
    return () => clearSocketError();
  }, [state.socketError, clearSocketError, setError]);

  return { WarningDialogComponent };
}
