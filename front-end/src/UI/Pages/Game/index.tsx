import React, { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import FontFaceObserver from 'fontfaceobserver';
import styled from 'styled-components';
import Loading from '../../Templates/Loading';
import { SocketEventName } from '../../../Games/dto/constants/game.constants';
import useGame from '../../../Hooks/useGame';
import { useSocket } from '../../../Hooks/useSocket';

const GameView = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function RealGame() {
  const { state, dispatch } = useSocket();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const game = useGame(state.socket, searchParams, state.gameState);
  const onInviteResult = React.useCallback(
    (title: string, msg: string | undefined) => {
      dispatch({
        action: 'setSocketError',
        error: {
          headerMessage: title,
          bodyMessage: msg ?? '알 수 없는 이유',
        },
      });
      navigate(-1);
    },
    [navigate, dispatch],
  );
  React.useEffect(() => {
    if (state.gameState?.mode === 'create') {
      state.socket?.on(
        SocketEventName.GAME_INVITE_RES,
        (msg) => !msg.success && onInviteResult('게임 초대 실패', msg.error),
      );
      state.socket?.on(SocketEventName.GAME_REFUSE_RES, (msg) =>
        onInviteResult('게임 초대 거절됨', msg.message),
      );
    }
    if (state.gameState?.mode === 'join') {
      state.socket?.on(
        SocketEventName.GAME_ACCEPT_RES,
        (msg) => !msg.success && onInviteResult('게임 참여 실패', msg.error),
      );
    }
    return () => {
      state.socket?.off(SocketEventName.GAME_INVITE_RES);
      state.socket?.off(SocketEventName.GAME_ACCEPT_RES);
      state.socket?.off(SocketEventName.GAME_REFUSE_RES);
    };
  }, [state.socket, state.gameState, onInviteResult]);
  React.useEffect(() => {
    document.getElementById('game-view')?.appendChild(game.view);
    return () => {
      document.getElementById('game-view')?.removeChild(game.view);
    };
  }, [game]);
  if (state.socket === null) {
    return <Navigate to="/" replace />;
  }
  return <GameView id="game-view" />;
}

export default function Game() {
  const [isLoading, setLoadingState] = useState(true);
  Promise.all([new FontFaceObserver('Bit5x3').load()]).then(
    () => {
      setLoadingState(false);
    },
    () => {
      // error
      setLoadingState(false);
    },
  );
  if (isLoading) return <Loading message="폰트를 불러오는 중입니다." />;
  return <RealGame />;
}
