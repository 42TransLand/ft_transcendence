import React from 'react';
import { FaBell, FaUsers } from 'react-icons/fa';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { TabPanels, TabList, Tabs, TabPanel } from '@chakra-ui/react';
import FriendTab from '../MainSocialTabPanelFriend';
import NotificationTab from '../MainSocialTabPanelNotification';
import ChatTab from '../MainSocialTabPanelChat';
import TabListElement from '../../Atoms/TabListElement';

export default function SocialTabs() {
  return (
    <Tabs isFitted isManual>
      <TabList mb="1em">
        <TabListElement icon={FaUsers} label="친구" />
        <TabListElement icon={FaBell} label="알림" />
        <TabListElement icon={BsFillChatDotsFill} label="채팅" />
      </TabList>
      <TabPanels>
        <TabPanel>
          <FriendTab />
        </TabPanel>
        <TabPanel>
          <NotificationTab />
        </TabPanel>
        <TabPanel>
          <ChatTab />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
