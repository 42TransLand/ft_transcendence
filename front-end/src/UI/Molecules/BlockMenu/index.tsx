import React from 'react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { MenuItem, Text } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import useWarningDialog from '../../../Hooks/useWarningDialog';

function BlockMenu({
  icon,
  label,
  targetName,
}: {
  icon: IconType;
  label: string;
  targetName: string;
}) {
  const { setError, WarningDialogComponent } = useWarningDialog();
  const queryClient = useQueryClient();
  const onClickHandler = () => {
    const url =
      label === '차단하기'
        ? `/friend/block/${targetName}`
        : `/friend/unblock/${targetName}`;
    axios
      .patch(url)
      .then(() => {
        queryClient.invalidateQueries(['friend']);
        setError({
          headerMessage: '차단 성공',
          bodyMessage: `${targetName}님을 ${label}에 성공했습니다.`,
        });
      })
      .catch((err) => {
        if (err.response) {
          setError({
            headerMessage: '차단 실패',
            bodyMessage: err.response.data.message,
          });
        } else {
          setError({
            headerMessage: '차단 실패',
            bodyMessage: err.message,
          });
        }
      });
  };

  return (
    <>
      <MenuItem onClick={onClickHandler} icon={<Icon as={icon} />}>
        <Text>{label}</Text>
      </MenuItem>
      {WarningDialogComponent}
    </>
  );
}

export default BlockMenu;
