import React from 'react';
import { Text, HStack, Spacer, Avatar, AvatarBadge } from '@chakra-ui/react';

function FriendElement(props: { userName: string; connectionStatus: string }) {
  const { userName, connectionStatus } = props;
  let status;

  if (connectionStatus === 'online') status = 'green.500';
  else if (connectionStatus === 'offline') status = 'red.500';
  else if (connectionStatus === 'ingame') status = 'yellow.500';
  return (
    <HStack
      bgColor="blue.200"
      borderWidth="1px"
      borderColor="black"
      h="30px"
      w="200px"
      justify="center"
    >
      <Avatar boxSize="1.25em" name={userName} size="sm">
        <AvatarBadge boxSize="0.3em" borderColor={status} />
      </Avatar>
      <Spacer />
      <Text>{userName}</Text>
    </HStack>
  );
}

export default FriendElement;
