import React from 'react';
import axios from 'axios';
import { FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import InviteGameProps from '../Props/InviteGameProps';
import useWarningDialog from './useWarningDialog';

export default function useInviteGame(id: number) {
  const { setError, WarningDialogComponent } = useWarningDialog();
  const navigate = useNavigate();
  const onSubmit = React.useCallback(
    (values: InviteGameProps, helper: FormikHelpers<InviteGameProps>) => {
      axios
        .post('/game/invite', {
          id, // TODO: 실제 보내야 할 대상 유저ID로 수정
          mode: values.mode,
        })
        .then(() => {
          navigate(`/game?mode=custom`); // TODO: 실제 게임 경로?
        })
        .catch((err) => {
          if (err.response) {
            setError({
              headerMessage: '초대 실패',
              bodyMessage: err.response.data.message,
            });
          } else {
            setError({
              headerMessage: '초대 실패',
              bodyMessage: err.message,
            });
          }
          helper.setSubmitting(false);
        });
    },
    [id, navigate, setError],
  );
  return { onSubmit, WarningDialogComponent };
}
