/* eslint-disable */

import axios from 'axios';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../../../Hooks/useChat';
import useMe from '../../../Hooks/useMe';
import useFriends from '../../../Hooks/useFriends';
import USERS_PROFILE_GET from '../../../Queries/Users/Profile';
import { useQuery } from '@tanstack/react-query';
import ChatMemberRole from '../../../Props/ChatMemberRole';
// import DirectMessageProps from '../../../Props/DirectMessageProps';

function DMContent() {
  const { userName } = useParams();
  const targetName: string = userName ?? '';
  const [, dispatch] = useChat();
  const { id: myId, nickname: myName, profileImg: myProfileImg } = useMe();
  const { data } = useQuery(USERS_PROFILE_GET(targetName));

  useEffect(() => {
    dispatch({
      action: 'updateInfo',
      chatInfo: {
        roomType: 'private',
        channelId: 0, // dummy
        channelName: targetName,
        maxHeadCount: 2,
      },
    });
    dispatch({
      action: 'insertMember',
      chatMember: {
        userId: myId,
        name: myName,
        profileImg: `${process.env.REACT_APP_API_HOST}/${myProfileImg}`,
        role: ChatMemberRole.MEMBER,
        muted: false,
        blocked: false,
      },
    });
    dispatch({
      action: 'insertMember',
      chatMember: {
        userId: data?.id ?? '',
        name: data?.nickname ?? '',
        profileImg: `${process.env.REACT_APP_API_HOST}/${data?.profileImg}`,
        role: ChatMemberRole.MEMBER,
        muted: false,
        blocked: false,
      },
    });
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
