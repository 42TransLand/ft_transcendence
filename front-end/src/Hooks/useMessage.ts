import React from 'react';
import axios from 'axios';
import { useChat } from './useChat';
import ChatMemberProps from '../Props/ChatMemberProps';
import ChatInfoProps from '../Props/ChatInfoProps';
import ChannelType from '../Props/ChannelType';

interface ChatMessageProps {
  senderNickName: string;
  content: string;
}

type UpdateChatMemberProps = {
  userId: string;
} & Partial<ChatMemberProps>;

export default function useMessage() {
  const [state, dispatch] = useChat();

  const insertRoomMember = React.useCallback(
    (chatMember: ChatMemberProps) => {
      dispatch({
        action: 'insertMember',
        chatMember,
      });
    },
    [dispatch],
  );
  const updateRoomMember = React.useCallback(
    (chatMember: UpdateChatMemberProps) => {
      const found = state.chatMembers.find(
        (u) => u.userId === chatMember.userId,
      );
      if (!found) return;
      dispatch({
        action: 'updateMember',
        chatMember: {
          ...found,
          ...chatMember,
        },
      });
    },
    [dispatch, state.chatMembers],
  );

  const upsertRoomMember = React.useCallback(
    (chatMember: ChatMemberProps) => {
      const found = state.chatMembers.find(
        (u) => u.userId === chatMember.userId,
      );
      if (found) {
        updateRoomMember(chatMember);
      } else {
        insertRoomMember(chatMember);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.chatMembers],
  );
  const deleteRoomMember = React.useCallback(
    (name: string) => {
      dispatch({
        action: 'deleteMember',
        name,
      });
    },
    [dispatch],
  );
  const dispatchRoomProtection = React.useCallback(
    (roomType: ChannelType) => {
      dispatch({
        action: 'updateInfo',
        chatInfo: { roomType, channelName: state.chatInfo.channelName },
      });
    },
    [state.chatInfo.channelName, dispatch],
  );
  const dispatchRoomInfo = React.useCallback(
    (chanInfoProps: ChatInfoProps) => {
      dispatch({
        action: 'updateInfo',
        chatInfo: chanInfoProps,
      });
    },
    [dispatch],
  );
  const displayDMHistory = React.useCallback(
    (targetName: string) => {
      axios.get(`/dm/${targetName}`).then((response) => {
        const DMList: ChatMessageProps[] = response.data;
        DMList.forEach((dm) => {
          dispatch({
            action: 'chat',
            name: dm.senderNickName,
            message: dm.content,
          });
        });
      });
    },
    [dispatch],
  );
  const dispatchChat = React.useCallback(
    (nickname: string, message: string) => {
      dispatch({
        action: 'chat',
        name: nickname,
        message,
      });
    },
    [dispatch],
  );

  return {
    dispatchRoomInfo,
    dispatchChat,
    displayDMHistory,
    insertRoomMember,
    updateRoomMember,
    upsertRoomMember,
    deleteRoomMember,
    dispatchRoomProtection,
  };
}
