import { VStack } from '@chakra-ui/react';
import React from 'react';
import MyProfile from '../../Organisms/MainSocialMyProfile';
import MainSocialSocial from '../../Organisms/MainSocialSocial';

function MainSocial() {
  return (
    <VStack h="100%">
      <MyProfile />
      <MainSocialSocial />
    </VStack>
  );
}

export default MainSocial;
