import React from 'react';
import { Text, HStack, Spacer, Avatar, AvatarBadge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FriendOnlineState } from '../../../Hooks/useSocket';

function FriendElement(props: {
  userName: string;
  userProfileImage: string;
  connectionStatus: FriendOnlineState;
}) {
  const { userName, userProfileImage, connectionStatus } = props;
  const StatusColors = {
    ONLINE: 'green.500',
    OFFLINE: 'red.500',
    PLAYING: 'yellow.500',
    SPECTATING: 'pink.500',
  };
  const statusColor = StatusColors[connectionStatus] ?? 'blackAlpha.900';

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
      <Avatar name={userName} src={userProfileImage} size="lg">
        <AvatarBadge boxSize="1em" bgColor={statusColor} />
      </Avatar>
      <Spacer />
      <Text>{userName}</Text>
    </HStack>
  );
}

export default FriendElement;
