import React from 'react';
import { ChatProvider } from '../../../Hooks/useChat';
import DirectMessage from '../../Templates/DirectMessage';

export default function Chat({ dm }: { dm: boolean }) {
  return (
    <ChatProvider>{dm ? <DirectMessage /> : <DirectMessage />}</ChatProvider>
  );
}
