import React from 'react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MenuItem, Text, useToast } from '@chakra-ui/react';
import { useTargetUser } from '../../../Hooks/useTargetUser';
import useWarningDialog from '../../../Hooks/useWarningDialog';

function MuteMenu({ icon, label }: { icon: IconType; label: string }) {
  const { userName } = useTargetUser();
  const { id } = useParams();
  const { setError, WarningDialogComponent } = useWarningDialog();
  const toast = useToast();

  const handleMenuClick = React.useCallback(() => {
    const url =
      label === '음소거시키기'
        ? `/chat/mute/${id}/${userName}`
        : `/chat/unmute/${id}/${userName}`;
    axios
      .patch(url)
      .then(() => {
        toast({
          title: `${label}`,
          description: `${userName}님을 ${label}에 성공했습니다.`,
          status: 'success',
          duration: 1000,
          isClosable: true,
        });
      })
      .catch((err) => {
        if (err.response) {
          setError({
            headerMessage: `${label} 실패`,
            bodyMessage: err.response.data.message,
          });
        } else {
          setError({
            headerMessage: `${label} 실패`,
            bodyMessage: err.message,
          });
        }
      });
  }, [id, label, setError, toast, userName]);

  return (
    <>
      <MenuItem onClick={handleMenuClick} icon={<Icon as={icon} />}>
        <Text>{label}</Text>
      </MenuItem>
      {WarningDialogComponent}
    </>
  );
}

export default MuteMenu;
