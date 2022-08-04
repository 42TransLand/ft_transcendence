import React from 'react';
import { Box, VStack } from '@chakra-ui/react';
import UserProfileInfo from '../../Molecules/UserProfileInfo';
import UserGameInfo from '../../Molecules/UserGameInfo';
import UserMatchHistory from '../../Organisms/UserMatchHistory';

function ProfileContent(props: { isMyself: boolean }) {
  const { isMyself } = props;
  const userName = '엄준식은살아있다';
  const userImage =
    'https://mblogthumb-phinf.pstatic.net/MjAyMDA2MTlfMTY5/MDAxNTkyNTAyNDM2ODcy.FVNsc1SOtS2sUfyaajXNhZpYzAKIFeUg_vCTqzHW4SIg.kQsV680NF1XfoVcDgPg64yF0RzHyRs0-raId3LTIIG4g.JPEG.wndyd75/hqdefault1.jpg?type=w2';
  const userRating = 2400;
  const userTier = 'Challenger';
  const userWins = 7500;
  const userLosses = 2500;

  return (
    <Box w="100%" h="500px">
      <VStack h="100%">
        <UserProfileInfo
          userName={userName}
          userImage={userImage}
          isMyself={isMyself}
        />
        <UserGameInfo
          userRating={userRating}
          userTier={userTier}
          userWins={userWins}
          userLosses={userLosses}
        />
        <UserMatchHistory />
      </VStack>
    </Box>
  );
}

export default ProfileContent;
