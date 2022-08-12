import React from 'react';
import { Text, HStack, Avatar, Button, Icon } from '@chakra-ui/react';
import { FaUserPlus } from 'react-icons/fa';
import UserSearchResultProps from '../../../Props/UserSearchResultProps';
import useAddFriend from '../../../Hooks/useAddFriend';

function SearchFriendResultElement({
  id,
  nickname,
  profileImg,
}: UserSearchResultProps) {
  const { isSubmitting, onAddFriend, WarningDialogComponent } = useAddFriend(
    id,
    nickname,
  );

  return (
    <>
      <HStack
        fontSize="xl"
        borderWidth="1px"
        borderRadius="md"
        h="45px"
        w="100%"
        p={3}
        justifyContent="space-between"
      >
        <Avatar name={nickname} size="sm" src={profileImg} />
        <HStack>
          <Text>{nickname}</Text>
          <Button
            backgroundColor="transparent"
            p={1}
            onClick={onAddFriend}
            isLoading={isSubmitting}
          >
            <Icon
              as={FaUserPlus}
              boxSize="2em"
              p="0.3em"
              border="1px"
              borderRadius="md"
              borderColor="gray.300"
            />
          </Button>
        </HStack>
      </HStack>
      {WarningDialogComponent}
    </>
  );
}

export default SearchFriendResultElement;
