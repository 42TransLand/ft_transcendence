import { VStack } from '@chakra-ui/react';
import React from 'react';
import NotificationElement from '../../Molecules/NotificationElement';

function NotificationTab() {
  return (
    <VStack>
      <NotificationElement userName="Lil Baby" />
      <NotificationElement userName="Lil Baby" />
      <NotificationElement userName="Lil Baby" />
      <NotificationElement userName="Lil Baby" />
    </VStack>
  );
}

export default NotificationTab;
