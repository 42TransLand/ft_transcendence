import React from 'react';
import { VStack, HStack, Avatar, Text, Box, Spacer } from '@chakra-ui/react';
import { FaMedal } from 'react-icons/fa';
import ElementList from '../ElementList';

function UserProfileInfo(props: { userName: string; userImage: string }) {
  const { userName, userImage } = props;
  return (
    <HStack>
      <Avatar name={userName} src={userImage} size="xl" />
      <Text fontSize="3xl">{userName}</Text>
    </HStack>
  );
}

function UserGameInfo(props: {
  userRating: number;
  userTier: string;
  userWins: number;
  userLosses: number;
}) {
  const { userRating, userTier, userWins, userLosses } = props;
  const userWinRate = (userWins / (userWins + userLosses)) * 100;

  return (
    <HStack borderWidth="1px" borderRadius="md" padding={1}>
      <FaMedal size={60} />
      <VStack>
        <HStack>
          <Text color="blue.400" fontSize="3xl">
            {userTier}
          </Text>
          <Text>(RP {userRating})</Text>
        </HStack>
        <HStack>
          <Text>승률</Text>
          <Text fontSize="xl" as="strong">
            {' '}
            {userWinRate.toFixed(2)}%
          </Text>
          <Text>
            ({userWins}승 {userLosses}패)
          </Text>
        </HStack>
      </VStack>
    </HStack>
  );
}

function UserMatch(props: {
  opponentUserName: string;
  opponentUserIamge: string | undefined;
  userScore: number;
  opponentScore: number;
  isRankedGame: boolean;
  isNormalMode: boolean;
}) {
  const {
    opponentUserName,
    opponentUserIamge,
    userScore,
    opponentScore,
    isRankedGame,
    isNormalMode,
  } = props;
  const isUserWinner: boolean = userScore > opponentScore;

  return (
    <HStack w="100%" padding={3}>
      <Avatar name={opponentUserName} src={opponentUserIamge} size="md" />
      <Spacer />
      <Text>vs</Text>
      <Text fontSize="3xl">{opponentUserName}</Text>
      <Spacer />
      <Text>
        {userScore}:{opponentScore}
      </Text>
      <Spacer />
      <Text as="sup" color="red.500">
        {isRankedGame ? '랭크' : ''}
      </Text>
      <Text>{isNormalMode ? '기본모드' : '부스터모드'}</Text>
      <Spacer />
      <Text color={isUserWinner ? 'blue.400' : 'red.300'} fontSize="3xl">
        {isUserWinner ? '승리' : '패배'}
      </Text>
    </HStack>
  );
}

function UserMatchHistory() {
  return (
    <Box width="100%" height="100%" borderWidth="1px" borderRadius="md">
      <ElementList>
        <UserMatch
          opponentUserName="YuriMyWife"
          opponentUserIamge={undefined}
          userScore={10}
          opponentScore={8}
          isRankedGame
          isNormalMode
        />
        <UserMatch
          opponentUserName="PAKA"
          opponentUserIamge={undefined}
          userScore={6}
          opponentScore={10}
          isRankedGame={false}
          isNormalMode
        />
        <UserMatch
          opponentUserName="YuriMyWife"
          opponentUserIamge={undefined}
          userScore={10}
          opponentScore={8}
          isRankedGame
          isNormalMode
        />
      </ElementList>
    </Box>
  );
}

function UserInfoContent(/* props: { isMyself: boolean } */) {
  // const {isMySelf} = props;
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
        <UserProfileInfo userName={userName} userImage={userImage} />
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

export default UserInfoContent;
