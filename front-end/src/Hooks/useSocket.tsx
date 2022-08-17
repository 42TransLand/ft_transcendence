import React from 'react';
import { io, Socket } from 'socket.io-client';
import WarningDialogProps from '../Props/WarningDialogProps';
import GameMode from '../WebSockets/dto/constants/game.mode.enum';
import GameTicket from '../WebSockets/dto/constants/game.ticket.enum';
import UserState from '../WebSockets/dto/constants/user.state.enum';
import StateUpdateUserNotify from '../WebSockets/dto/res/state.update.user.notify.dto';

enum SocketState {
  CONNECTING,
  CONNECTED,
  CONNECT_ERROR,
  DISCONNECTED,
}

export type GameStateType = {
  ticket: GameTicket;
  opponentNickname: string;
  gameMode?: GameMode;
  scoreForWin?: number;
};

type SocketStateType = {
  socket: Socket | null;
  socketState: SocketState;
  friendState: { [key: string]: UserState };
  gameState: GameStateType | null;
  socketError: WarningDialogProps;
};

const initialSocketState: SocketStateType = {
  socket: null,
  socketState: SocketState.DISCONNECTED,
  friendState: {},
  gameState: null,
  socketError: { headerMessage: '', bodyMessage: '' },
};

type SocketActionType =
  | { action: 'connect'; socket: Socket }
  | { action: 'connect_failed' }
  | { action: 'connected' }
  | { action: 'disconnect' }
  | { action: 'updateUserState'; friendId: string; state: UserState }
  | {
      action: 'setCustomGame';
      gameState: GameStateType | null;
    }
  | {
      action: 'setSocketError';
      error: WarningDialogProps;
    };

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
    case 'updateUserState':
      return {
        ...beforeState,
        friendState: {
          ...beforeState.friendState,
          [action.friendId]: action.state,
        },
      };
    case 'setCustomGame':
      return {
        ...beforeState,
        gameState: action.gameState,
      };
    case 'setSocketError':
      return {
        ...beforeState,
        socketError: action.error,
      };
    default:
      return beforeState;
  }
}

export function UpdateUserStateListener(
  socket: Socket,
  dispatch: React.Dispatch<SocketActionType>,
) {
  socket.on('updateUserState', (data: StateUpdateUserNotify) => {
    dispatch({
      action: 'updateUserState',
      friendId: data.id,
      state: data.state,
    });
  });
}

function SocketProvider({
  nickname,
  children,
}: {
  nickname: string;
  children: React.ReactNode;
}) {
  const [state, dispatch] = React.useReducer(SocketReducer, initialSocketState);
  const val = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

  React.useEffect(() => {
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
  }, [nickname]);

  return (
    <SocketStateContext.Provider value={val}>
      {children}
    </SocketStateContext.Provider>
  );
}

export { SocketProvider, useSocket, SocketState };
