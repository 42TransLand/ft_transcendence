import React from 'react';
import { io, Socket } from 'socket.io-client';

type SocketStateType = {
  socket: Socket | null;
};
const initialSocketState: SocketStateType = {
  socket: null,
};

type SocketActionType =
  | { action: 'connect'; socket: Socket }
  | { action: 'disconnect' };

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

function SocketReducer(state: SocketStateType, action: SocketActionType) {
  switch (action.action) {
    case 'connect':
      return { ...state, socket: action.socket };
    case 'disconnect':
      return { ...state, socket: null };
    default:
      return state;
  }
}

function SocketProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(SocketReducer, initialSocketState);
  const val = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);
  React.useEffect(() => {
    const socket = io(
      `${process.env.REACT_APP_WEBSOCKET_HOST}${process.env.REACT_APP_WEBSOCKET_URI}`,
      {
        transports: ['websocket'],
        autoConnect: false,
      },
    );
    dispatch({ action: 'connect', socket });
    socket.connect();
  }, []);
  return (
    <SocketStateContext.Provider value={val}>
      {children}
    </SocketStateContext.Provider>
  );
}

export { SocketProvider, useSocket };
