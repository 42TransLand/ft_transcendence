import React from 'react';
import { HStack, Text, Avatar } from '@chakra-ui/react';
import { FaMedal } from 'react-icons/fa';
import UserContextMenu from '../../Templates/UserContextMenu';

function MyProfile(props: { userName: string; userImage: string }) {
  const { userName, userImage } = props;

  return (
    <UserContextMenu mode="self" eventType="click">
      <HStack
        bgColor="orange.300"
        w="100%"
        h="175px"
        fontSize="3xl"
        justify="center"
      >
        <Avatar name={userName} src={userImage} size="xl" />
        <FaMedal />
        <Text>{userName}</Text>
      </HStack>
    </UserContextMenu>
  );
}

export default MyProfile;
