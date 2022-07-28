import React from 'react';
import { Socket } from 'socket.io-client';
import GameContext from '../Games/GameContext';

export default function useGame(
  socket: Socket | null,
  searchParams: URLSearchParams,
) {
  const gameContext = React.useMemo(
    () => new GameContext(socket as Socket, searchParams),
    [searchParams, socket],
  );
  React.useEffect(() => {
    gameContext.onComponentDidMount();
    return () => {
      gameContext.onComponentWillUnmount();
    };
  }, [gameContext]);

  return gameContext;
}
