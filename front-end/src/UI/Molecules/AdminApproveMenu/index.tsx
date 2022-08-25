import React from 'react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';

import { MenuItem, Text } from '@chakra-ui/react';
import { useChat } from '../../../Hooks/useChat';
import { useTargetUser } from '../../../Hooks/useTargetUser';

function AdminApproveMenu({
  icon,
  label,
  cast,
}: {
  icon: IconType;
  label: string;
  cast: boolean;
}) {
  const [, dispatch] = useChat();
  const { userName } = useTargetUser();

  const handleMenuClick = React.useCallback(() => {
    dispatch({
      action: 'enqueueEvent',
      event: {
        type: cast ? 'adminApproved' : 'adminUnapproved',
        target: userName,
        commandSuccessful: [true, false, undefined][
          Math.floor(Math.random() * 3)
        ],
      },
    });
  }, [cast, userName, dispatch]);

  return (
    <MenuItem onClick={handleMenuClick} icon={<Icon as={icon} />}>
      <Text>{label}</Text>
    </MenuItem>
  );
}

export default AdminApproveMenu;
