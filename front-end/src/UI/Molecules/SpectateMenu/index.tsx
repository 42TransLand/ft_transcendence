import React, { useRef } from 'react';
import { MenuItem, Text, useDisclosure } from '@chakra-ui/react';
import { MdSmartDisplay } from 'react-icons/md';
import WarningAlertDialog from '../../Atoms/WarningAlertDialog';

function SpectateMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef(null);
  const success = false;

  return (
    <>
      <MenuItem onClick={onOpen} icon={<MdSmartDisplay />}>
        <Text>관전하기</Text>
      </MenuItem>
      {success === false && (
        <WarningAlertDialog
          isOpen={isOpen}
          onClose={onClose}
          cancelRef={cancelRef}
          headerMessage="엥 이게 뭐지"
          bodyMessage="관전에 실패했습니다"
        />
      )}
    </>
  );
}

export default SpectateMenu;
