import React from 'react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { MenuItem, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useTargetUser } from '../../../Hooks/useTargetUser';
import useWarningDialog from '../../../Hooks/useWarningDialog';

function AdminApproveMenu({
  icon,
  label,
  cast,
}: {
  icon: IconType;
  label: string;
  cast: boolean;
}) {
  const { userName } = useTargetUser();
  const { id } = useParams();
  const { setError, WarningDialogComponent } = useWarningDialog();
  const url = cast ? `/chat/role/${id}` : `/chat/unrole/${id}`;

  const handleMenuClick = React.useCallback(() => {
    axios.patch(url, { nickname: userName }).catch((err) => {
      if (err.response) {
        setError({
          headerMessage: 'admin setting error',
          bodyMessage: err.response.data.message,
        });
      } else {
        setError({
          headerMessage: 'admin setting error',
          bodyMessage: err.message,
        });
      }
    });
  }, [userName, setError, url]);

  return (
    <>
      <MenuItem onClick={handleMenuClick} icon={<Icon as={icon} />}>
        <Text>{label}</Text>
      </MenuItem>
      {WarningDialogComponent}
    </>
  );
}

export default AdminApproveMenu;
