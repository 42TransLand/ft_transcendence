import React from 'react';
import { AvatarBadge, Icon } from '@chakra-ui/react';
import { FaCrown } from 'react-icons/fa';
import ChatMemberRole from '../../../Props/ChatMemberRole';

export default function ChatAvatarBadge({
  role,
  blocked,
}: {
  role: ChatMemberRole;
  blocked: boolean;
}) {
  return role === ChatMemberRole.OWNER || role === ChatMemberRole.ADMIN ? (
    <AvatarBadge
      opacity={blocked ? '35%' : '100%'}
      border={0}
      position="absolute"
      top="-360%"
      left="-100%"
      zIndex={30}
    >
      <Icon
        as={FaCrown}
        boxSize="0.75em"
        color={role === ChatMemberRole.OWNER ? 'yellow.300' : 'gray.500'}
      />
    </AvatarBadge>
  ) : (
    <div />
  );
}
