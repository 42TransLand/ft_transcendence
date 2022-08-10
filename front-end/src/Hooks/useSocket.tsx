import React from 'react';
import { io, Socket } from 'socket.io-client';
import { useQuery } from '@tanstack/react-query';
import USERS_ME_GET from '../Queries/Users/Me';

enum SocketState {
  CONNECTING,
  CONNECTED,
  CONNECT_ERROR,
  DISCONNECTED,
}

enum FriendOnlineState {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  PLAYING = 'PLAYING',
  SPECTATING = 'SPECTATING',
}

type SocketStateType = {
  socket: Socket | null;
  socketState: SocketState;
  friendState: { [key: number]: FriendOnlineState };
};
const initialSocketState: SocketStateType = {
  socket: null,
  socketState: SocketState.DISCONNECTED,
  friendState: [],
};

type SocketActionType =
  | { action: 'connect'; socket: Socket }
  | { action: 'connect_failed' }
  | { action: 'connected' }
  | { action: 'disconnect' }
  | { action: 'updateFriendState'; friendId: number; state: FriendOnlineState };

type SocketContextType = {
  state: SocketStateType;
  dispatch: React.Dispatch<SocketActionType>;
};

const SocketStateContext = React.createContext<SocketContextType | null>(null);

function useSocket() {
  const context = React.useContext(SocketStateContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context as SocketContextType;
}

function SocketReducer(beforeState: SocketStateType, action: SocketActionType) {
  switch (action.action) {
    case 'connect':
      return {
        ...beforeState,
        socket: action.socket,
        socketState: SocketState.CONNECTING,
      };
    case 'connect_failed':
      return { ...beforeState, socketState: SocketState.CONNECT_ERROR };
    case 'connected':
      return { ...beforeState, socketState: SocketState.CONNECTED };
    case 'disconnect':
      return {
        ...beforeState,
        socket: null,
        socketState: SocketState.DISCONNECTED,
      };
    case 'updateFriendState':
      return {
        ...beforeState,
        friendState: {
          ...beforeState.friendState,
          [action.friendId]: action.state,
        },
      };
    default:
      return beforeState;
  }
}

function SocketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(SocketReducer, initialSocketState);
  const val = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
  const { data, isLoading, error } = useQuery(USERS_ME_GET);

  React.useEffect(() => {
    if (isLoading) return;
    if (error) return;

    const { nickname } = data;
    const socket = io(
      `${process.env.REACT_APP_WEBSOCKET_HOST}${process.env.REACT_APP_WEBSOCKET_URI}`,
      {
        transports: ['websocket'],
        autoConnect: false,
        query: { user: nickname },
      },
    );
    dispatch({ action: 'connect', socket });
    socket.on('connect_failed', () => {
      dispatch({ action: 'connect_failed' });
    });
    socket.on('connect', () => {
      dispatch({ action: 'connected' });
    });
    socket.connect();
  }, [data, isLoading, error]);

  return (
    <SocketStateContext.Provider value={val}>
      {children}
    </SocketStateContext.Provider>
  );
}

export { SocketProvider, useSocket, SocketState, FriendOnlineState };
