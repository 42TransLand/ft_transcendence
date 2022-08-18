/* eslint-disable */

import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatActionType, useChat } from '../../../Hooks/useChat';
import useMe from '../../../Hooks/useMe';
import useFriends from '../../../Hooks/useFriends';
import USERS_PROFILE_GET from '../../../Queries/Users/Profile';
import { useQuery } from '@tanstack/react-query';
import ChatMemberRole from '../../../Props/ChatMemberRole';

function dispatchRoomInfo(
  dispatch: (value: ChatActionType) => void,
  roomType: 'private' | 'protected' | 'public',
  channelId: number,
  channelName: string,
) {
  dispatch({
    action: 'updateInfo',
    chatInfo: {
      roomType,
      channelId,
      channelName,
      maxHeadCount: 2,
    },
  });
}

function dispatchRoomMember(
  dispatch: (value: ChatActionType) => void,
  userId: string,
  name: string,
  profileImg: string,
  role: ChatMemberRole,
  muted: boolean,
  blocked: boolean,
) {
  dispatch({
    action: 'insertMember',
    chatMember: {
      userId,
      name,
      profileImg,
      role,
      muted,
      blocked,
    },
  });
}

function DMContent() {
  const { userName } = useParams();
  const targetName: string = userName ?? '';
  const [, dispatch] = useChat();
  const { id: myId, nickname: myName, profileImg: myProfileImg } = useMe();
  const { isLoading, data } = useQuery(USERS_PROFILE_GET(targetName));

  useEffect(() => {
    axios
      .get(`/dms/${targetName}`)
      .then((response) => {
        console.log('response:', response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  }, []);
  useEffect(() => {
    if (data) {
      dispatchRoomInfo(
        dispatch,
        'private',
        data?.id ? Number(data?.id) : 0,
        targetName,
      );
      dispatchRoomMember(
        dispatch,
        myId,
        myName,
        `${process.env.REACT_APP_API_HOST}/${myProfileImg}`,
        ChatMemberRole.MEMBER,
        false,
        false,
      );
      dispatchRoomMember(
        dispatch,
        data?.id ?? '',
        data?.nickname ?? '',
        `${process.env.REACT_APP_API_HOST}/${data?.profileImg}`,
        ChatMemberRole.MEMBER,
        false,
        false,
      );
    }
  }, [targetName, dispatch, isLoading]);
  return <div />;
}

export default DMContent;
