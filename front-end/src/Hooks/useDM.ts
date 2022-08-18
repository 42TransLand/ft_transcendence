import { useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ChatActionType, useChat } from './useChat';
import useMe from './useMe';
import USERS_PROFILE_GET from '../Queries/Users/Profile';
import ChatMemberRole from '../Props/ChatMemberRole';

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

interface DMProps {
  senderNickName: string;
  content: string;
}

function useDM() {
  const { userName } = useParams();
  const targetName: string = userName ?? '';
  const [, dispatch] = useChat();
  const { id: myId, nickname: myName, profileImg: myProfileImg } = useMe();
  const { isLoading, data } = useQuery(USERS_PROFILE_GET(targetName));

  useEffect(() => {
    axios
      .get(`/dm/${targetName}`)
      .then((response) => {
        const DMList: DMProps[] = response.data;
        DMList.forEach((dm) => {
          dispatch({
            action: 'chat',
            name: dm.senderNickName,
            message: dm.content,
          });
        });
      })
      .catch((err) => {
        console.log('err:', err);
      });
  }, [dispatch, targetName]);
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
  }, [targetName, dispatch, isLoading, data, myId, myName, myProfileImg]);

  const dispatchDM = (nickname: string, message: string) => {
    dispatch({
      action: 'chat',
      name: nickname,
      message,
    });
  };

  return dispatchDM;
}

export default useDM;
