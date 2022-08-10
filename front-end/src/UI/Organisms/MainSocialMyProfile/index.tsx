import React from 'react';
import { HStack, Text, Avatar } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import UserContextMenu from '../../Templates/UserContextMenu';
import USERS_ME_GET from '../../../Queries/Users/Me';

function ProfileContent({ nickname }: { nickname: string | undefined }) {
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
          <Avatar name={nickname} size="xl" />
          <Text textColor="white">{nickname}</Text>
        </>
      ) : (
        <Text textColor="white">Loading</Text>
      )}
    </HStack>
  );
}

function MyProfile() {
  const { data, isLoading, error } = useQuery(USERS_ME_GET);

  if (isLoading) return <ProfileContent nickname={undefined} />;
  if (error) return <ProfileContent nickname="Error" />;

  const { id, nickname } = data;

  return (
    <UserContextMenu target={id} targetName={nickname} mode="self">
      <ProfileContent nickname={nickname} />
    </UserContextMenu>
  );
}

export default MyProfile;
