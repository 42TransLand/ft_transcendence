import React from 'react';
import { Text, HStack, Spacer, Avatar, AvatarBadge } from '@chakra-ui/react';

function FriendElement(props: { userName: string; connectionStatus: string }) {
  const { userName, connectionStatus } = props;
  const StatusColors: { [key: string]: string } = {
    online: 'green.500',
    offline: 'red.500',
    ingame: 'yellow.500',
  };
  const statusColor = StatusColors[connectionStatus];

  return (
    <HStack
      fontSize="xl"
      borderWidth="1px"
      borderRadius="md"
      h="80px"
      w="100%"
      padding={3}
    >
      <Avatar name={userName} size="lg">
        <AvatarBadge boxSize="1em" bgColor={statusColor} />
      </Avatar>
      <Spacer />
      <Text>{userName}</Text>
    </HStack>
  );
}

export default FriendElement;
