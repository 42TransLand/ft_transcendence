import React from 'react';
import { HStack, Avatar, Spacer, Text } from '@chakra-ui/react';

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

export default UserMatch;
