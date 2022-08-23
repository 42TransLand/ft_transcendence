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

export default function useMessage() {
  const [state, dispatch] = useChat();

  const upsertRoomMember = React.useCallback(
    (chatMember: ChatMemberProps) => {
      const idx = state.chatMembers.findIndex(
        (c) => c.userId === chatMember.userId,
      );
      if (idx === -1) {
        dispatch({
          action: 'insertMember',
          chatMember,
        });
      } else {
        dispatch({
          action: 'updateMember',
          chatMember,
        });
      }
    },
    [dispatch, state.chatMembers],
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
    upsertRoomMember,
    deleteRoomMember,
    dispatchRoomProtection,
  };
}
