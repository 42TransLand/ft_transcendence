import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';

import { MenuItem, Text } from '@chakra-ui/react';
// import { useChat } from '../../../Hooks/useChat';
import { useTargetUser } from '../../../Hooks/useTargetUser';
import useWarningDialog from '../../../Hooks/useWarningDialog';

/** 디스패치 용도를 몰라서 일단 지우지 않고 있음. */

function KickMenu({ icon, label }: { icon: IconType; label: string }) {
  // const [, dispatch] = useChat();
  const { userName } = useTargetUser();
  const { id } = useParams();
  const { setError, WarningDialogComponent } = useWarningDialog();

  const handleMenuClick = React.useCallback(() => {
    axios
      .delete(`/chat/kick/${id}/${userName}`)
      .then(() => {
        // dispatch({
        //   action: 'enqueueEvent',
        //   event: {
        //     type: 'kicked',
        //     target: userName,
        //     commandSuccessful: [true, false, undefined][
        //       Math.floor(Math.random() * 3)
        //     ],
        //   },
        // });
      })
      .catch((err) => {
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
