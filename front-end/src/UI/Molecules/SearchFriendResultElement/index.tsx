import React from 'react';
import { Text, HStack, Avatar, Button, Icon } from '@chakra-ui/react';
import { FaUserPlus } from 'react-icons/fa';
import UserSearchResultProps from '../../../Props/UserSearchResultProps';

function SearchFriendResultElement({
  id,
  nickname,
  profileIcon,
}: UserSearchResultProps) {
  // TODO
  const onAddFriend = React.useCallback(() => {
    alert(`유저-${id}(${nickname}) 대상을 친구로 추가합니다.`);
  }, [id, nickname]);

  return (
    <HStack
      fontSize="xl"
      borderWidth="1px"
      borderRadius="md"
      h="45px"
      w="100%"
      p={3}
      justifyContent="space-between"
    >
      <Avatar name={nickname} size="sm" src={profileIcon} />
      <HStack>
        <Text>{nickname}</Text>
        <Button backgroundColor="transparent" p={1} onClick={onAddFriend}>
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
  );
}

export default SearchFriendResultElement;
