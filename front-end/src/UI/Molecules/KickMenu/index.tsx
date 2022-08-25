import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';

import { MenuItem, Text } from '@chakra-ui/react';
import { useTargetUser } from '../../../Hooks/useTargetUser';
import useWarningDialog from '../../../Hooks/useWarningDialog';

function KickMenu({ icon, label }: { icon: IconType; label: string }) {
  const { userName } = useTargetUser();
  const { id } = useParams();
  const { setError, WarningDialogComponent } = useWarningDialog();

  const handleMenuClick = React.useCallback(() => {
    axios.delete(`/chat/kick/${id}/${userName}`).catch((err) => {
      if (err.response) {
        setError({
          headerMessage: '오류 발생',
          bodyMessage: err.response.data.message,
        });
      } else {
        setError({
          headerMessage: '오류 발생',
          bodyMessage: err.message,
        });
      }
    });
  }, [id, setError, userName]);

  return (
    <>
      <MenuItem onClick={handleMenuClick} icon={<Icon as={icon} />}>
        <Text>{label}</Text>
      </MenuItem>
      {WarningDialogComponent}
    </>
  );
}

export default KickMenu;
