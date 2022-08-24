import React from 'react';
import { ChatProvider } from '../../../Hooks/useChat';
import ChatMessage from '../../Templates/ChatMessage';
import DirectMessage from '../../Templates/DirectMessage';

export default function Chat({ dm }: { dm: boolean }) {
  return (
    <ChatProvider>{dm ? <DirectMessage /> : <ChatMessage />}</ChatProvider>
  );
}
