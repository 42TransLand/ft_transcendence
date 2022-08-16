import React from 'react';
import { Socket } from 'socket.io-client';
import GameContext from '../WebSockets/game/GameContext';
import { GameStateType } from './useSocket';

export default function useGame(
  socket: Socket | null,
  searchParams: URLSearchParams,
  gameState: GameStateType | null,
) {
  const gameContext = React.useMemo(
    () => new GameContext(socket as Socket, gameState, searchParams),
    [searchParams, gameState, socket],
  );
  React.useEffect(() => {
    gameContext.onComponentDidMount();
    return () => {
      gameContext.onComponentWillUnmount();
    };
  }, [gameContext]);

  return gameContext;
}
