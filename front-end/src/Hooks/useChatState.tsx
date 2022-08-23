import React from 'react';

export enum ChatStateRequestType {
  JOIN = 'JOIN',
  CREATE = 'CREATE',
}

export interface ChatStateRequestContext {
  type: ChatStateRequestType;
  password?: { password: string };
}

export interface ChatStateContextType {
  request: ChatStateRequestContext | null;
  setRequest: React.Dispatch<
    React.SetStateAction<ChatStateRequestContext | null>
  >;
}

const ChatStateContext = React.createContext<ChatStateContextType | null>(null);

export function useChatState() {
  const context = React.useContext(ChatStateContext);
  if (!context) {
    throw new Error('useChatState must be used within a ChatStateProvider');
  }
  return context;
}

export function ChatStateProvider({ children }: { children: JSX.Element }) {
  const [request, setRequest] = React.useState({
    type: ChatStateRequestType.JOIN,
  });
  const val = React.useMemo(() => {
    const v = { request, setRequest } as ChatStateContextType;
    return v;
  }, [request]);
  return (
    <ChatStateContext.Provider value={val}>
      {children}
    </ChatStateContext.Provider>
  );
}
