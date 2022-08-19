import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FormikHelpers } from 'formik';
import axios from 'axios';
import useToastedChat from '../../../Hooks/useToastedChat';
import useMe from '../../../Hooks/useMe';
import useMessage from '../../../Hooks/useMessage';
import ChatModal from '../../Organisms/ChatModal';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import USERS_PROFILE_GET from '../../../Queries/Users/Profile';
import ChatMemberRole from '../../../Props/ChatMemberRole';

export default function DMChat() {
  const { dispatchRoomInfo, dispatchChat, displayDMHistory, insertRoomMember } =
    useMessage();
  const navigate = useNavigate();
  const { nickname } = useMe();
  const { userName } = useParams();
  const targetName: string = userName ?? '';
  useToastedChat(nickname);
  const onSubmitHandler = useCallback(
    (
      values: { message: string },
      helper: FormikHelpers<{ message: string }>,
    ) => {
      const { message } = values;
      if (message.length === 0) return;
      axios
        .post(`/dm/send/${targetName}`, { content: message })
        .catch((err) => {
          console.log(err);
        });
      dispatchChat(nickname, message);
      helper.resetForm();
    },
    [dispatchChat, nickname, targetName],
  );
  const { setError, WarningDialogComponent } = useWarningDialog(() =>
    navigate(-1),
  );
  const { isLoading, error, data } = useQuery(USERS_PROFILE_GET(targetName));
  useEffect(() => {
    if (!targetName || isLoading || error) {
      setError({
        headerMessage: '오류 발생',
        bodyMessage: error
          ? '서버와의 통신에 실패했습니다.'
          : '정상적인 접근이 아닙니다.',
      });
      return;
    }
    dispatchRoomInfo({
      roomType: 'private',
      channelName: targetName,
    });
    insertRoomMember({
      userId: data.id,
      name: data.nickname,
      profileImg: `${process.env.REACT_APP_API_HOST}/${data.profileImg}`,
      role: ChatMemberRole.MEMBER,
      muted: false,
      blocked: false,
    });
    displayDMHistory(targetName);
  }, [
    isLoading,
    error,
    dispatchRoomInfo,
    targetName,
    setError,
    insertRoomMember,
    displayDMHistory,
    data,
  ]);
  if (isLoading) {
    return <div>로딩중...</div>;
  }

  return (
    <>
      <ChatModal onSubmitHandler={onSubmitHandler} />
      {WarningDialogComponent}
    </>
  );
}
