import React from 'react';
import {
  Text,
  HStack,
  Spacer,
  Avatar,
  AvatarBadge,
  VStack,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import UserState from '../../../WebSockets/dto/constants/user.state.enum';

function FriendElement(props: {
  userName: string;
  userProfileImage: string;
  connectionStatus: UserState;
  isBlocked: boolean;
}) {
  const { userName, userProfileImage, connectionStatus, isBlocked } = props;
  const StatusColors = {
    ONLINE: 'green.500',
    OFFLINE: 'red.500',
    INGAME: 'yellow.500',
    OBSERVE: 'blue.500',
  };
  const statusText = React.useMemo(() => {
    switch (connectionStatus) {
      case UserState.ONLINE:
        return '온라인';
      case UserState.OFFLINE:
        return '오프라인';
      case UserState.INGAME:
        return '게임중';
      case UserState.OBSERVE:
        return '관전중';
      default:
        return '오프라인';
    }
  }, [connectionStatus]);

  return (
    <HStack
      as={Link}
      fontSize="xl"
      borderWidth="1px"
      borderRadius="md"
      h="80px"
      w="100%"
      padding={3}
      to={`/dm/${userName}`}
    >
      <Avatar
        opacity={isBlocked ? '35%' : '100%'}
        name={userName}
        src={userProfileImage}
        size="lg"
      >
        <AvatarBadge boxSize="1em" bgColor={StatusColors[connectionStatus]} />
      </Avatar>
      <Spacer />
      <VStack justifyContent="space-evenly">
        <Text opacity={isBlocked ? '35%' : '100%'}>{userName}</Text>
        <Text
          w="full"
          fontSize="xs"
          fontWeight="bold"
          textAlign="right"
          textColor={StatusColors[connectionStatus]}
        >
          {statusText}
        </Text>
      </VStack>
    </HStack>
  );
}

export default FriendElement;
