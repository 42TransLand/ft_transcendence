import React from 'react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';

import axios from 'axios';
import { useParams } from 'react-router-dom';
import { MenuItem, Text } from '@chakra-ui/react';
// import { useChat } from '../../../Hooks/useChat';
import { useTargetUser } from '../../../Hooks/useTargetUser';
import useWarningDialog from '../../../Hooks/useWarningDialog';

function BanMenu({ icon, label }: { icon: IconType; label: string }) {
  // const [, dispatch] = useChat();
  const { id } = useParams();
  const { userName } = useTargetUser();
  const { setError, WarningDialogComponent } = useWarningDialog();

  const handleMenuClick = React.useCallback(() => {
    axios
      .post(`/chat/ban/${id}/${userName}`)
      .then(() => {
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
    // dispatch({
    //   action: 'enqueueEvent',
    //   event: {
    //     type: 'banned',
    //     target: userName,
    //     commandSuccessful: [true, false, undefined][
    //       Math.floor(Math.random() * 3)
    //     ],
    //   },
    // });
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

export default BanMenu;
