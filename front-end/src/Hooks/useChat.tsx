import React from 'react';
import ChatMemberProps from '../Props/ChatMemberProps';
import ChatInfoProps from '../Props/ChatInfoProps';
import ChatElementProps from '../Props/ChatElementProps';
import ChatEvent from '../Props/ChatEvent';

export interface ChatStateType {
  chatInfo: ChatInfoProps;
  chatMembers: ChatMemberProps[];
  chats: ChatElementProps[];
  events: ChatEvent[];
}

export type ChatActionType =
  | { action: 'updateInfo'; chatInfo: ChatInfoProps }
  | { action: 'insertMember'; chatMember: ChatMemberProps }
  | { action: 'updateMember'; chatMember: ChatMemberProps }
  | { action: 'deleteMember'; name: string }
  | { action: 'chat'; name: string; message: string }
  | { action: 'enqueueEvent'; event: ChatEvent }
  | { action: 'clearEvents' };
type ChatContextType = {
  state: ChatStateType;
  dispatch: React.Dispatch<ChatActionType>;
};

const ChatContext = React.createContext<ChatContextType | null>(null);

function ChatReducer(state: ChatStateType, action: ChatActionType) {
  switch (action.action) {
    case 'updateInfo':
      return { ...state, chatInfo: action.chatInfo };
    case 'insertMember':
      return {
        ...state,
        chatMembers: [...state.chatMembers, action.chatMember],
      };
    case 'updateMember':
      return {
        ...state,
        chatMembers: state.chatMembers.map((member) => {
          if (member.name === action.chatMember.name) {
            return action.chatMember;
          }
          return member;
        }),
      };
    case 'deleteMember': {
      return {
        ...state,
        chatMembers: [
          ...state.chatMembers.filter(
            (m: ChatMemberProps) => m.name !== action.name,
          ),
        ],
      };
    }
    case 'chat': {
      const c = {
        id: state.chats.length,
        message: action.message,
        name: action.name,
      };
      return { ...state, chats: [...state.chats, c] };
    }
    case 'enqueueEvent': {
      return { ...state, events: [...state.events, action.event] };
    }
    case 'clearEvents': {
      return { ...state, events: [] };
    }
    default:
      return state;
  }
}

function useChat(): [ChatStateType, React.Dispatch<ChatActionType>] {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return [context.state, context.dispatch];
}

function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(ChatReducer, {
    chatInfo: {
      roomType: 'private',
      channelId: 0,
      channelName: '채팅방',
      maxHeadCount: 0,
    },
    chatMembers: [],
    chats: [],
    events: [],
  });
  const val = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <ChatContext.Provider value={val}>{children}</ChatContext.Provider>;
}

export { ChatProvider, useChat };
