import React from 'react';
import { Text, HStack, Avatar, Button, Icon } from '@chakra-ui/react';
import { FaUserPlus } from 'react-icons/fa';
import UserSearchResultProps from '../../../Props/UserSearchResultProps';
import WarningAlertDialog from '../../Templates/WarningAlertDialog';
import useAddFriend from '../../../Hooks/useAddFriend';

function SearchFriendResultElement({
  id,
  nickname,
  profileIcon,
}: UserSearchResultProps) {
  const { isSubmitting, error, clearError, cancelRef, onAddFriend } =
    useAddFriend(id);

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
        <Avatar name={nickname} size="sm" src={profileIcon} />
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
      <WarningAlertDialog
        isOpen={error.bodyMessage.length > 0}
        onClose={() => clearError()}
        cancelRef={cancelRef}
        headerMessage={error.headerMessage}
        bodyMessage={error.bodyMessage}
      />
    </>
  );
}

export default SearchFriendResultElement;
