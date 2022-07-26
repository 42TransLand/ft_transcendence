import React from 'react';
import { Text, HStack, Spacer, Avatar, AvatarBadge } from '@chakra-ui/react';

function FriendTap() {
  return (
    <HStack
      bgColor="blue.200"
      borderWidth="1px"
      borderColor="black"
      h="30px"
      w="200px"
      justify="center"
    >
      <Avatar boxSize="1.25em" name="Unknown" size="sm">
        <AvatarBadge boxSize="0.3em" borderColor="green" />
      </Avatar>
      <Spacer />
      <Text>NickName</Text>
    </HStack>
  );
}

export default FriendTap;
