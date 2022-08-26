import React from 'react';
import { HStack, Box, Avatar, Spacer, Text } from '@chakra-ui/react';

function UserMatch(props: {
  opponentUserName: string;
  opponentUserImage: string;
  userScore: number;
  opponentScore: number;
  isRankedGame: boolean;
  isNormalMode: boolean;
}) {
  const {
    opponentUserName,
    opponentUserImage,
    userScore,
    opponentScore,
    isRankedGame,
    isNormalMode,
  } = props;
  const isUserWinner: boolean = userScore > opponentScore;

  return (
    <HStack w="100%" padding={3} fontSize="xl">
      <Avatar name={opponentUserName} src={opponentUserImage} size="md" />
      <Spacer />
      <Text>vs</Text>
      <Text display="block" width="50%" fontSize="3xl">
        {opponentUserName}
      </Text>
      <Spacer />
      <Text>
        {userScore}:{opponentScore}
      </Text>
      <Spacer />
      <Box justifyContent="flex-end" width="10%" display="flex">
        <Text as="sup" color="red.500">
          {isRankedGame ? '랭크' : ''}
        </Text>
        <Text>{isNormalMode ? '기본모드' : '스피드모드'}</Text>
      </Box>
      <Spacer />
      <Text color={isUserWinner ? 'blue.400' : 'red.300'} fontSize="3xl">
        {isUserWinner ? '승리' : '패배'}
      </Text>
    </HStack>
  );
}

export default UserMatch;
