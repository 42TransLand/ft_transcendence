import React from 'react';
import {
  Grid,
  GridItem,
  Avatar,
  Text,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';

function GameInvitationContent(props: {
  userName: string;
  gameMode: string;
  isRanked: boolean;
  handleInvitation: (
    toastId: string,
    response: boolean,
    userName: string,
  ) => void;
}) {
  const { userName, gameMode, isRanked, handleInvitation } = props;

  return (
    <Grid
      h="100px"
      w="100%"
      bgColor="white"
      templateRows="repeat(3, 1fr)"
      templateColumns="repeat(10, 1fr)"
      borderWidth="1px"
      borderRadius="md"
      paddingX={3}
      paddingY={2}
    >
      <GridItem rowSpan={3} colSpan={1} margin="auto">
        <Avatar name={userName} size="md" />
      </GridItem>
      <GridItem rowSpan={1} colSpan={1} />
      <GridItem rowSpan={2} colSpan={8}>
        <Text fontSize="lg" lineHeight={1.25}>
          {userName}님께서
          <br />
          {gameMode} {isRanked ? '랭크' : '일반'} 게임에 초대하였습니다.
        </Text>
      </GridItem>
      <GridItem rowSpan={2} colSpan={1} />
      <GridItem rowSpan={1} colSpan={4} flex="">
        <Text fontSize="sm" paddingY={1.5}>
          방금전
        </Text>
      </GridItem>
      <GridItem rowSpan={1} colSpan={2} />
      <GridItem rowSpan={1} colSpan={2}>
        <HStack spacing={1}>
          <IconButton
            colorScheme="green"
            aria-label="accept"
            icon={<CheckIcon />}
            size="sm"
            onClick={() => handleInvitation(userName, true, userName)}
          />
          <IconButton
            colorScheme="red"
            aria-label="decline"
            icon={<CloseIcon />}
            size="sm"
            onClick={() => handleInvitation(userName, false, userName)}
          />
        </HStack>
      </GridItem>
    </Grid>
  );
}

export default GameInvitationContent;
