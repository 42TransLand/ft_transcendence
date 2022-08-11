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
import axios from 'axios';
import ModifiableUserName from '../../Molecules/ModifiableUserName';

function UserProfileInfo(props: {
  userName: string;
  userImage: string;
  isMyself: boolean;
}) {
  const { userName, userImage, isMyself } = props;

  const onChangeHandler = (event: { target: HTMLInputElement }): void => {
    const { target } = event;
    const formData = new FormData();
    if (target.files?.length) {
      formData.append('file', target.files[0]);
      axios.patch('/users/me', formData);
    }
  };

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
                  accept="image/jpeg"
                  position="absolute"
                  top="0"
                  left="0"
                  opacity="0"
                  cursor="pointer"
                  onChange={(event) => onChangeHandler(event)}
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
