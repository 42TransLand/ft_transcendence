import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Text, HStack, VStack, Icon } from '@chakra-ui/react';
import { GrFormClose } from 'react-icons/gr';
import USERS_PROFILE_GET from '../../../Queries/Users/Profile';

function DirectMessageToastContent(props: {
  userName: string;
  content: string;
  onClose: () => void;
}) {
  const { userName, content, onClose } = props;
  const { data } = useQuery(USERS_PROFILE_GET(userName));
  const { profileImg } = data ?? { profileSrc: '' };

  return (
    <HStack
      w="30em"
      backgroundColor="white"
      p="2"
      justifyContent="flex-start"
      borderRadius="md"
      borderWidth="1px"
    >
      <Avatar
        name={userName}
        src={`${process.env.REACT_APP_API_HOST}/${profileImg}`}
        size="lg"
        m={2}
      />
      <VStack w="full" justifyContent="space-around" alignItems="flex-start">
        <Text fontSize="lg" fontWeight="bold">
          {userName}
        </Text>
        <Text fontSize="sm" noOfLines={1}>
          {content}
        </Text>
      </VStack>
      <Icon
        as={GrFormClose}
        onClick={onClose}
        boxSize="2em"
        cursor="pointer"
        alignSelf="flex-start"
      />
    </HStack>
  );
}

export default DirectMessageToastContent;
