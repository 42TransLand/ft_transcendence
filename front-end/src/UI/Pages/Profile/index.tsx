import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ModalBody, ModalCloseButton, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import USERS_PROFILE_GET from '../../../Queries/Users/Profile';
import RoutedModal from '../../Templates/RoutedModal';
import ProfileContent from '../../Templates/ProfileContent';
import useMe from '../../../Hooks/useMe';

function Profile() {
  const { id: chatid, userName, name } = useParams();
  const { nickname: myNickname } = useMe();
  const { data, isLoading, error } = useQuery(
    USERS_PROFILE_GET(name ?? myNickname),
  );
  const baseUrl = React.useMemo(() => {
    if (chatid) {
      return `/chat/${chatid}`;
    }
    if (userName) {
      return `/dm/${userName}`;
    }
    return '/';
  }, [chatid, userName]);

  const { nickname, profileImg, gameRecord, winCount, loseCount, rankScore } =
    data ?? {
      rankScore: 0,
      nickname: '',
      profileImg: '',
      gameRecord: [],
      winCount: 0,
      loseCount: 0,
    };
  let modalBody;

  if (isLoading) {
    modalBody = <Text>로딩중...</Text>;
  } else if (error) {
    modalBody = <Text>{error.message}</Text>;
  } else {
    modalBody = (
      <ProfileContent
        nickname={nickname}
        userImage={`${process.env.REACT_APP_API_HOST}/${profileImg}`}
        isMyself={myNickname === nickname}
        userRating={rankScore}
        userWins={winCount}
        userLosses={loseCount}
        records={gameRecord}
      />
    );
  }
  return (
    <RoutedModal baseUrl={baseUrl}>
      <ModalCloseButton />
      <ModalBody>{modalBody}</ModalBody>
    </RoutedModal>
  );
}

export default Profile;
