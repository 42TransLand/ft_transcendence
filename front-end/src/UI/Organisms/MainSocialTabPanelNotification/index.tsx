import React from 'react';
import { VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import ALERT_GET from '../../../Queries/Alerts/All';
import NotificationElement from '../../Molecules/NotificationElement';

function NotificationTab() {
  const { data, isLoading, error } = useQuery(ALERT_GET);
  const notifications = React.useMemo(() => {
    if (isLoading || error) return [];
    return data;
  }, [data, isLoading, error]);

  return (
    <VStack>
      {notifications.map((notification) => (
        <NotificationElement
          key={notification.alertId}
          alertId={notification.alertId}
          requestor={notification.requestor}
          createdAt={notification.createdAt}
        />
      ))}
    </VStack>
  );
}

export default NotificationTab;
