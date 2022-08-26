import React from 'react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';

import { MenuItem, Text } from '@chakra-ui/react';
import useAddFriend from '../../../Hooks/useAddFriend';

function FriendMenu({
  icon,
  label,
  targetName,
}: {
  icon: IconType;
  label: string;
  targetName: string;
}) {
  const { onAddFriend, WarningDialogComponent } = useAddFriend(targetName);

  return (
    <>
      <MenuItem onClick={onAddFriend} icon={<Icon as={icon} />}>
        <Text>{label}</Text>
      </MenuItem>
      {WarningDialogComponent}
    </>
  );
}

export default FriendMenu;
