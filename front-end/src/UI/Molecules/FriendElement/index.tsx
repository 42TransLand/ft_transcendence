import React from 'react';
import { Text, HStack, Spacer, Avatar, AvatarBadge } from '@chakra-ui/react';
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
    OBSERVE: 'pink.500',
  };

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
      <Text opacity={isBlocked ? '35%' : '100%'}>{userName}</Text>
    </HStack>
  );
}

export default FriendElement;
