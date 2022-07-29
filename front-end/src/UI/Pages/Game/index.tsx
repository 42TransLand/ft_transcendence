import React, { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
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
  const { state } = useSocket();
  const [searchParams] = useSearchParams();
  const game = useGame(state.socket, searchParams);
  React.useEffect(() => {
    document.getElementById('game-view')?.appendChild(game.view);
    if (state.socket) {
      if (searchParams.get('mode') === 'match-making') {
        state.socket.emit(SocketEventName.GAME_ENQUEUE_MATCH_REQ);
      }
    }
    return () => {
      document.getElementById('game-view')?.removeChild(game.view);
    };
  }, [game, searchParams, state.socket]);
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
    (err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      setLoadingState(false);
    },
  );
  if (isLoading) return <Loading message="폰트를 불러오는 중입니다." />;
  return <RealGame />;
}
