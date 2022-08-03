import React from 'react';
import { useChat } from '../../../Hooks/useChat';
import ChatMemberElement from '../../Molecules/ChatMemberElement';
import UserContextMenu from '../../Templates/UserContextMenu';

export default function ChatMembers() {
  const [chat] = useChat();
  return (
    <>
      {chat.chatMembers.map((member) => (
        <UserContextMenu key={member.name} mode="chat" eventType="contextmenu">
          <ChatMemberElement
            profileIcon={member.profileIcon}
            name={member.name}
            role={member.role}
            muted={member.muted}
            blocked={member.blocked}
          />
        </UserContextMenu>
      ))}
    </>
  );
}
