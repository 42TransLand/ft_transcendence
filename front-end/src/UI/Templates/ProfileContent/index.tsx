import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import UserProfileInfo from '../../Organisms/UserProfileInfo';
import UserGameInfo from '../../Organisms/UserGameInfo';
import UserMatchHistory from '../../Organisms/UserMatchHistory';
import RecordProps from '../../../Props/RecordProps';

function ProfileContent(props: {
  nickname: string;
  userImage: string;
  userRating: number;
  userWins: number;
  userLosses: number;
  isMyself: boolean;
  records: RecordProps[];
}) {
  const {
    nickname,
    userImage,
    userRating,
    userWins,
    userLosses,
    isMyself,
    records,
  } = props;

  return (
    <Box w="100%" h="500px" paddingY={2}>
      <VStack h="100%" spacing={7}>
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
        <UserMatchHistory records={records} />
      </VStack>
    </Box>
  );
}

export default ProfileContent;
