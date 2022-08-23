import React from 'react';
import { Icon } from '@chakra-ui/icons';
import { IconType } from 'react-icons';
import { MenuItem, Text } from '@chakra-ui/react';
// import { useChat } from '../../../Hooks/useChat';
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
  // const [, dispatch] = useChat();
  const { userName } = useTargetUser();
  const { id } = useParams();
  const { setError, WarningDialogComponent } = useWarningDialog();

  const handleMenuClick = React.useCallback(() => {
    if (cast) {
      axios
        .patch(`/chat/role/${id}`, { userName })
        .then(() => {
          // dispatch({
          //   action: 'enqueueEvent',
          //   event: {
          //     type: cast ? 'adminApproved' : 'adminUnapproved',
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
    }
  }, [id, userName, setError, cast]);

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
