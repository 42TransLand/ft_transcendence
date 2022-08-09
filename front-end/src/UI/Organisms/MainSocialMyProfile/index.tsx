import React from 'react';
import { HStack, Text, Avatar } from '@chakra-ui/react';
import { FaMedal } from 'react-icons/fa';
import UserContextMenu from '../../Templates/UserContextMenu';

function MyProfile(props: {
  userId: number;
  userName: string;
  userImage: string;
}) {
  const { userId, userName, userImage } = props;

  return (
    <UserContextMenu target={userId} targetName={userName} mode="self">
      <HStack
        bgColor="#424556"
        w="100%"
        h="175px"
        fontSize="3xl"
        justify="center"
      >
        <Avatar name={userName} src={userImage} size="xl" />
        <FaMedal />
        <Text textColor="white">{userName}</Text>
      </HStack>
    </UserContextMenu>
  );
}

export default MyProfile;
