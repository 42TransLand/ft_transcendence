import React from 'react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { MenuItem, Text, useToast } from '@chakra-ui/react';
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
  const toast = useToast();
  const onClickHandler = () => {
    const url =
      label === '차단하기'
        ? `/friend/block/${targetName}`
        : `/friend/unblock/${targetName}`;
    axios
      .patch(url)
      .then(() => {
        queryClient.invalidateQueries(['friend']);
        queryClient.invalidateQueries(['blocks']);
        toast({
          title: `${label}`,
          description: `${targetName}님을 ${label}에 성공했습니다.`,
          status: 'success',
          duration: 1000,
          isClosable: true,
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
