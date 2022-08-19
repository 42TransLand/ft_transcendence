import React from 'react';
import { Text } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import LoginBody from '../../Templates/LoginBody';
import { OTPInputScheme, CodeValueType } from '../OTPRevise';
import OTPInput from '../../Molecules/OTPInput';
import useWarningDialog from '../../../Hooks/useWarningDialog';

function OTPLogin() {
  const queryClient = useQueryClient();
  const { setError, WarningDialogComponent } = useWarningDialog();
  const onSubmitHandler = React.useCallback(
    (values: CodeValueType, actions: FormikHelpers<CodeValueType>) => {
      axios
        .post('tfa/authenticate', { code: values.code })
        .then(() => {
          actions.setSubmitting(false);
          queryClient.invalidateQueries(['me']);
        })
        .catch((err) => {
          if (err.response) {
            setError({
              headerMessage: 'OTP로그인 실패',
              bodyMessage: err.response.data.message,
            });
          } else {
            setError({
              headerMessage: 'OTP로그인 실패',
              bodyMessage: '서버와의 연결이 원활하지 않습니다.',
            });
          }
          actions.setSubmitting(false);
          actions.resetForm();
        });
    },
    [setError, queryClient],
  );

  return (
    <LoginBody>
      <Formik
        initialValues={{ code: '' }}
        onSubmit={onSubmitHandler}
        validationSchema={OTPInputScheme}
      >
        {({ isSubmitting }) => (
          <Form>
            <Text color="white" fontSize="4xl">
              <b>Authentication Code를 입력하세요</b>
            </Text>
            <OTPInput
              textColor="white"
              size="100%"
              isSubmitting={isSubmitting}
            />
          </Form>
        )}
      </Formik>
      {WarningDialogComponent}
    </LoginBody>
  );
}

export default OTPLogin;
