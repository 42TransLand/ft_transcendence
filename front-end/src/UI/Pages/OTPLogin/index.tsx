import React from 'react';
import { Text } from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import LoginBody from '../../Templates/LoginBody';
import { OTPInputScheme, CodeValueType } from '../OTPRevise';
import OTPInput from '../../Molecules/OTPInput';

function OTPLogin() {
  const tempKey = '123456';
  const onSubmitHandler = React.useCallback(
    (values: CodeValueType, actions: FormikHelpers<CodeValueType>) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        if (values.code === tempKey) {
          actions.resetForm();
        }
      }, 500);
    },
    [],
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
    </LoginBody>
  );
}

export default OTPLogin;
