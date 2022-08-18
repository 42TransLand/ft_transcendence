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
// import DirectMessageProps from '../../../Props/DirectMessageProps';

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
  const { data } = useQuery(USERS_PROFILE_GET(targetName));

  useEffect(() => {
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
    dispatch({
      action: 'chat',
      name: '엄준식은살아있다',
      message: '왜',
    });
    // dispatch({
    //   action: 'updateInfo',
    //   chatInfo: {
    //     roomType: 'private',
    //     channelId: 0, // dummy
    //     channelName: targetName,
    //     maxHeadCount: 2,
    //   },
    // });
    // dispatch({
    //   action: 'insertMember',
    //   chatMember: {
    //     userId: myId,
    //     name: myName,
    //     profileImg: `${process.env.REACT_APP_API_HOST}/${myProfileImg}`,
    //     role: ChatMemberRole.MEMBER,
    //     muted: false,
    //     blocked: false,
    //   },
    // });
    // dispatch({
    //   action: 'insertMember',
    //   chatMember: {
    //     userId: data?.id ?? '',
    //     name: data?.nickname ?? '',
    //     profileImg: `${process.env.REACT_APP_API_HOST}/${data?.profileImg}`,
    //     role: ChatMemberRole.MEMBER,
    //     muted: false,
    //     blocked: false,
    //   },
    // });
    axios
      .get(`/dms/${targetName}`)
      .then((response) => {
        console.log('response:', response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  }, [targetName, dispatch]);
  return <div />;
}

export default DMContent;
