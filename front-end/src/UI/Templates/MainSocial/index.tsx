import { VStack } from '@chakra-ui/react';
import React from 'react';
import MyProfile from '../../Organisms/MainSocialMyProfile';
import SocialTabs from '../../Organisms/MainSocialTabs';

function MainSocial() {
  return (
    <VStack h="100%">
      <MyProfile />
      <MainSocialSocial />
      <SocialTabs />
    </VStack>
  );
}

export default MainSocial;
