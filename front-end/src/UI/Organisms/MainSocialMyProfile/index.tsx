import React from 'react';
import { HStack, Text, Avatar } from '@chakra-ui/react';
import UserContextMenu from '../../Templates/UserContextMenu';
import useMe from '../../../Hooks/useMe';

function ProfileContent({
  nickname,
  profileImg,
}: {
  nickname: string;
  profileImg: string;
}) {
  return (
    <HStack
      bgColor="#424556"
      w="100%"
      h="175px"
      fontSize="3xl"
      justify="center"
    >
      {nickname ? (
        <>
          <Avatar name={nickname} src={profileImg} size="xl" />
          <Text textColor="white">{nickname}</Text>
        </>
      ) : (
        <Text textColor="white">Loading</Text>
      )}
    </HStack>
  );
}

function MyProfile() {
  const { id, nickname, profileImg } = useMe();

  return (
    <UserContextMenu target={id} targetName={nickname} mode="self">
      <ProfileContent nickname={nickname} profileImg={profileImg} />
    </UserContextMenu>
  );
}

export default MyProfile;
