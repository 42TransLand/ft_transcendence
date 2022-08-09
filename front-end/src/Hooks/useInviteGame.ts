import React from 'react';
import axios from 'axios';
import { FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import WarningDialogProps from '../Props/WarningDialogProps';
import InviteGameProps from '../Props/InviteGameProps';

export default function useInviteGame(id: number) {
  const [error, setError] = React.useState<WarningDialogProps>({
    headerMessage: '',
    bodyMessage: '',
  });
  const clearError = React.useCallback(
    () => setError({ headerMessage: '', bodyMessage: '' }),
    [setError],
  );
  const navigate = useNavigate();
  const cancelRef = React.useRef(null); // TODO: 삭제하기
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
    [id, navigate],
  );
  return { error, clearError, cancelRef, onSubmit };
}
