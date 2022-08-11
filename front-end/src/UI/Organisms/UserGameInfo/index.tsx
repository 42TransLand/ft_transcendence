import React, { useMemo } from 'react';
import { HStack, VStack, Text, Image } from '@chakra-ui/react';

function calc(rating: number) {
  if (rating >= 2500)
    return {
      userTierText: 'master',
      userTierColor: '#ae96e1',
      userRankIcon: '/rank_icons/master.png',
    };
  if (rating >= 2000)
    return {
      userTierText: 'diamond',
      userTierColor: '#7ae2fb',
      userRankIcon: '/rank_icons/diamond.png',
    };
  if (rating >= 1500)
    return {
      userTierText: 'platinum',
      userTierColor: '#e2fefe',
      userRankIcon: '/rank_icons/platinum.png',
    };
  if (rating >= 1000)
    return {
      userTierText: 'gold',
      userTierColor: '#f9e872',
      userRankIcon: '/rank_icons/gold.png',
    };
  if (rating >= 500)
    return {
      userTierText: 'silver',
      userTierColor: '#989898',
      userRankIcon: '/rank_icons/silver.png',
    };
  return {
    userTierText: 'bronze',
    userTierColor: '#b2763c',
    userRankIcon: '/rank_icons/bronze.png',
  };
}

function UserGameInfo(props: {
  userRating: number;
  userWins: number;
  userLosses: number;
}) {
  const { userRating, userWins, userLosses } = props;
  const { userTierText, userTierColor, userRankIcon } = calc(userRating);

  const userWinRate = useMemo(
    () =>
      userWins === 0 && userLosses === 0
        ? 0
        : (userWins / (userWins + userLosses)) * 100,
    [userWins, userLosses],
  );

  return (
    <HStack borderWidth="1px" borderRadius="md" padding={1}>
      <Image src={userRankIcon} boxSize={20} />
      <VStack>
        <HStack>
          <Text color={userTierColor} fontSize="3xl">
            {userTierText}
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
