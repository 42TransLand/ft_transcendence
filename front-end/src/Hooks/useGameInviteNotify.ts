import React from 'react';
import GameMode from '../WebSockets/dto/constants/game.mode.enum';
import SocketEventName from '../WebSockets/dto/constants/socket.events.enum';
import GameMatchDto from '../WebSockets/dto/req/game.match.dto';
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
      state.socket?.off(SocketEventName.GAME_INVITE_NOTIFY, onInviteNotify);
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
