import React from 'react';
import { HStack, VStack, Text } from '@chakra-ui/react';
import { FaMedal } from 'react-icons/fa';

function UserGameInfo(props: {
  userRating: number;
  userTier: string;
  userWins: number;
  userLosses: number;
}) {
  const { userRating, userTier, userWins, userLosses } = props;
  const userWinRate = (userWins === 0 && userLosses === 0) ? 0 : (userWins / (userWins + userLosses)) * 100;

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

export default UserGameInfo;
