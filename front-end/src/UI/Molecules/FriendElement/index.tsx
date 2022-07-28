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
      bgColor="blue.200"
      borderWidth="1px"
      borderColor="black"
      h="100%"
      w="100%"
      justify="center"
    >
      <Avatar boxSize="1.25em" name={userName} size="lg">
        <AvatarBadge boxSize="0.3em" borderColor={statusColor} />
      </Avatar>
      <Spacer />
      <Text>{userName}</Text>
    </HStack>
  );
}

export default FriendElement;
