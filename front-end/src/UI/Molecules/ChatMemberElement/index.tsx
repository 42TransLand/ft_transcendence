import React from 'react';
import { Text, HStack, Icon, Spacer, Avatar } from '@chakra-ui/react';
import { BsFillMicMuteFill } from 'react-icons/bs';
import ChatMemberProps from '../../../Props/ChatMemberProps';
import ChatAvatarBadge from '../../Atoms/ChatAvatar';

export default function ChatMemberElement(props: ChatMemberProps) {
  const { profileImg, name, role, muted, blocked } = props;

  return (
    <HStack borderWidth="1px" borderRadius="md" h="60px" w="100%" padding={3}>
      <Avatar
        opacity={blocked ? '35%' : '100%'}
        boxSize="1.25em"
        src={profileImg}
        name={name}
        size="lg"
      >
        <ChatAvatarBadge role={role} blocked={blocked} />
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
