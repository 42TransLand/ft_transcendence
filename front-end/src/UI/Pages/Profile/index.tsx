import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ModalBody, ModalCloseButton, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import USERS_PROFILE_GET from '../../../Queries/Users/Profile';
import RoutedModal from '../../Templates/RoutedModal';
import ProfileContent from '../../Templates/ProfileContent';
import useMe from '../../../Hooks/useMe';

function Profile() {
  const { name } = useParams();
  const { nickname: myNickname, rankScore } = useMe();
  const { data, isLoading, error } = useQuery(
    USERS_PROFILE_GET(name ?? myNickname),
  );
  const { nickname, profileImg } = data ?? { nickname: '', profileImg: '' };
  let modalBody;

  if (isLoading) {
    modalBody = <Text>로딩중...</Text>;
  } else if (error) {
    modalBody = <Text>{error.message}</Text>;
  } else {
    modalBody = (
      <ProfileContent
        nickname={nickname}
        userImage={profileImg}
        isMyself={myNickname === nickname}
        userRating={rankScore}
        userWins={7500}
        userLosses={2500}
      />
    );
  }
  return (
    <RoutedModal>
      <ModalCloseButton />
      <ModalBody>{modalBody}</ModalBody>
    </RoutedModal>
  );
}

export default Profile;
