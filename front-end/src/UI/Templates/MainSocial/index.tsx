import React from 'react';
import { VStack } from '@chakra-ui/react';
import MyProfile from '../../Organisms/MainSocialMyProfile';
import SocialTabs from '../../Organisms/MainSocialTabs';

function MainSocial() {
  return (
    <VStack h="100vh">
      <MyProfile />
      <SocialTabs />
    </VStack>
  );
}

export default MainSocial;
