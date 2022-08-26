import { AxiosError } from 'axios';
import React from 'react';
import WarningDialogProps from '../Props/WarningDialogProps';
import WarningAlertDialog from '../UI/Templates/WarningAlertDialog';

export default function useWarningDialog(onClose?: () => void | undefined) {
  const [error, setError] = React.useState<WarningDialogProps>({
    headerMessage: '',
    bodyMessage: '',
  });
  const clearError = React.useCallback(() => {
    setError({ headerMessage: '', bodyMessage: '' });
    if (onClose) onClose();
  }, [setError, onClose]);
  const cancelRef = React.useRef(null);
  const onError = React.useCallback(
    (err: WarningDialogProps | AxiosError<any, any>) => {
      if ('headerMessage' in err) {
        setError(err as WarningDialogProps);
      } else {
        const aerr = err as AxiosError<any, any>;
        if (aerr.response) {
          setError({
            headerMessage: '오류 발생',
            bodyMessage: aerr.response.data.message,
          });
        } else {
          setError({
            headerMessage: '오류 발생',
            bodyMessage: aerr.message,
          });
        }
      }
    },
    [setError],
  );

  return {
    setError: onError,
    WarningDialogComponent: (
      <WarningAlertDialog
        isOpen={error.bodyMessage.length > 0}
        onClose={() => clearError()}
        cancelRef={cancelRef}
        headerMessage={error.headerMessage}
        bodyMessage={error.bodyMessage}
      />
    ),
  };
}
