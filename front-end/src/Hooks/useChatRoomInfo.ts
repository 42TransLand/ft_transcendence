import React from 'react';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ChannelType from '../Props/ChannelType';
import ROOM_GET from '../Queries/Channels/Room';
import useMessage from './useMessage';
import { ChatStateRequestType, useChatState } from './useChatState';

export default function useChatRoomInfo() {
  const { id } = useParams();
  const chatRoomId = id ?? '';
  const queryClient = useQueryClient();
  const { dispatchRoomInfo } = useMessage();
  const { error, isLoading, data } = useQuery(ROOM_GET(chatRoomId));
  const { setRequest } = useChatState();

  // cleanup
  React.useEffect(() => {
    if (!chatRoomId || error || isLoading) return () => {};
    return () => {
      setRequest({ type: ChatStateRequestType.JOIN });
      axios
        .delete(`/chat/leave/${chatRoomId}`)
        .then(() => queryClient.invalidateQueries(['channels']));
    };
  }, [chatRoomId, error, isLoading, queryClient, setRequest]);

  // room info
  React.useEffect(() => {
    if (isLoading || error) return;
    dispatchRoomInfo({
      roomType: data.type ?? ChannelType.PUBLIC,
      channelName: data.name ?? '채팅방',
    });
  }, [dispatchRoomInfo, data, isLoading, error]);
}
