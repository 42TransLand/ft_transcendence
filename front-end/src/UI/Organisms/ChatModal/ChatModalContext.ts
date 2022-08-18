import React from 'react';

const ChatModalContext =
  React.createContext<React.RefObject<HTMLDivElement> | null>(null);

export default ChatModalContext;
