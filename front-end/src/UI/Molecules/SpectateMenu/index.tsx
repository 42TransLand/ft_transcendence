import React from 'react';
import { MenuItem, Text } from '@chakra-ui/react';
import { MdSmartDisplay } from 'react-icons/md';
import axios from 'axios';
import useWarningDialog from '../../../Hooks/useWarningDialog';

function SpectateMenu() {
  const { setError, WarningDialogComponent } = useWarningDialog();
  const onClickHandler = () => {
    axios
      .get('/test/spectate')
      .then(() => {
        // 방id response로 받아서 거기로 라우팅 시켜주면 될 듯
        // api로 차단된 여부를 받았다면, setError실패 해주면 될 듯
      })
      .catch((err) => {
        if (err.response) {
          setError({
            headerMessage: '관전하기 실패',
            bodyMessage: err.response.data.message,
          });
        } else {
          setError({
            headerMessage: '관전하기 실패',
            bodyMessage: err.message,
          });
        }
      });
  };

  return (
    <>
      <MenuItem onClick={onClickHandler} icon={<MdSmartDisplay />}>
        <Text>관전하기</Text>
      </MenuItem>
      {WarningDialogComponent}
    </>
  );
}

export default SpectateMenu;
