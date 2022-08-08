import React from 'react';
import { VStack } from '@chakra-ui/react';
import MyProfile from '../../Organisms/MainSocialMyProfile';
import SocialTabs from '../../Organisms/MainSocialTabs';

const myUser = {
  userId: 1,
  userName: '엄준식은살아있다',
  userImage:
    'https://mblogthumb-phinf.pstatic.net/MjAyMDA2MTlfMTY5/MDAxNTkyNTAyNDM2ODcy.FVNsc1SOtS2sUfyaajXNhZpYzAKIFeUg_vCTqzHW4SIg.kQsV680NF1XfoVcDgPg64yF0RzHyRs0-raId3LTIIG4g.JPEG.wndyd75/hqdefault1.jpg?type=w2',
};

function MainSocial() {
  return (
    <VStack h="100vh">
      <MyProfile
        userId={myUser.userId}
        userName={myUser.userName}
        userImage={myUser.userImage}
      />
      <SocialTabs />
    </VStack>
  );
}

export default MainSocial;
