import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import UserProfileInfo from '../../Organisms/UserProfileInfo';
import UserGameInfo from '../../Organisms/UserGameInfo';
import UserMatchHistory from '../../Organisms/UserMatchHistory';

function ProfileContent(props: {
  nickname: string;
  userImage: string;
  userRating: number;
  userWins: number;
  userLosses: number;
  isMyself: boolean;
}) {
  const { nickname, userImage, userRating, userWins, userLosses, isMyself } =
    props;

  return (
    <Box w="100%" h="500px">
      <VStack h="100%">
        <UserProfileInfo
          userName={nickname}
          userImage={userImage}
          isMyself={isMyself}
        />
        <UserGameInfo
          userRating={userRating}
          userWins={userWins}
          userLosses={userLosses}
        />
        <UserMatchHistory />
      </VStack>
    </Box>
  );
}

export default ProfileContent;
