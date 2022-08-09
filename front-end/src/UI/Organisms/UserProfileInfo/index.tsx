import React from 'react';
import {
  HStack,
  Avatar,
  AvatarBadge,
  Box,
  AspectRatio,
  Input,
} from '@chakra-ui/react';
import { MdAddPhotoAlternate } from 'react-icons/md';
import ModifiableUserName from '../../Molecules/ModifiableUserName';

function UserProfileInfo(props: {
  userName: string;
  userImage: string;
  isMyself: boolean;
}) {
  const { userName, userImage, isMyself } = props;

  return (
    <HStack>
      <Avatar name={userName} src={userImage} size="xl">
        {isMyself && (
          <AvatarBadge borderWidth={0}>
            <AspectRatio width="30px" ratio={1}>
              <Box>
                <Box
                  position="relative"
                  height="100%"
                  width="100%"
                  fontSize="3xl"
                  color="gray"
                >
                  <MdAddPhotoAlternate />
                </Box>
                <Input
                  type="file"
                  accept="image/*"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  cursor="pointer"
                />
              </Box>
            </AspectRatio>
          </AvatarBadge>
        )}
      </Avatar>
      <ModifiableUserName userName={userName} isMyself={isMyself} />
    </HStack>
  );
}

export default UserProfileInfo;
