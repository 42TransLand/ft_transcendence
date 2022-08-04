import React, { useRef } from 'react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';

import { MenuItem, useDisclosure, Text } from '@chakra-ui/react';
import WarningAlertDialog from '../../Atoms/WarningAlertDialog';

function FriendMenu({ icon, label }: { icon: IconType; label: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const success = false;
  const headerMessage = label === '친구추가' ? '친구추가' : '친구삭제';
  const bodyMessage =
    label === '친구추가'
      ? '친구추가에 실패했습니다'
      : '친구삭제에 실패했습니다';

  return (
    <>
      <MenuItem onClick={onOpen} icon={<Icon as={icon} />}>
        <Text>{label}</Text>
      </MenuItem>
      {success === false && (
        <WarningAlertDialog
          isOpen={isOpen}
          onClose={onClose}
          cancelRef={cancelRef}
          headerMessage={headerMessage}
          bodyMessage={bodyMessage}
        />
      )}
    </>
  );
}

export default FriendMenu;
