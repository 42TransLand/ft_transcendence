import React from 'react';
import {
  Text,
  HStack,
  Avatar,
  AvatarBadge,
  Icon,
  Spacer,
} from '@chakra-ui/react';
import { FaCrown } from 'react-icons/fa';
import { BsFillMicMuteFill } from 'react-icons/bs';
import ChatMemberProps from '../../../Props/ChatMemberProps';

export default function ChatMemberElement({
  profileIcon,
  name,
  role,
  muted,
  blocked,
}: ChatMemberProps) {
  return (
    <HStack borderWidth="1px" borderRadius="md" h="60px" w="100%" padding={3}>
      <Avatar
        opacity={blocked ? '35%' : '100%'}
        boxSize="1.25em"
        src={profileIcon}
        name={name}
        size="lg"
      >
        {(role === 'owner' || role === 'admin') && (
          <AvatarBadge
            opacity={blocked ? '35%' : '100%'}
            border={0}
            position="absolute"
            top="-360%"
            left="-100%"
          >
            <Icon
              as={FaCrown}
              boxSize="0.75em"
              color={role === 'owner' ? 'yellow.300' : 'gray.500'}
            />
          </AvatarBadge>
        )}
      </Avatar>
      <Text
        opacity={blocked ? '35%' : '100%'}
        color={muted ? 'red.500' : 'black'}
        fontSize="lg"
      >
        {name}
      </Text>
      {muted && (
        <>
          <Spacer />
          <Icon
            opacity={blocked ? '35%' : '100%'}
            as={BsFillMicMuteFill}
            boxSize="1em"
            color="red.500"
          />
        </>
      )}
    </HStack>
  );
}
