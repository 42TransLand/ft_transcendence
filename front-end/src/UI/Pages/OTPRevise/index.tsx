import React, { useState } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  VStack,
  Box,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import TwoFAInput from '../../Molecules/TwoFAInput';
import RoutedModal from '../../Templates/RoutedModal';

const CreateChannelScheme = Yup.object().shape({
  code: Yup.string()
    .typeError('6자리 코드를 입력해주세요.')
    .min(6, '6자리 코드를 입력해주세요.')
    .max(6, '6자리 코드를 입력해주세요.'),
});

type CodeValueType = {
  code: string;
};

function OTPBody({
  isSubmitting,
  isEnabled,
}: {
  isSubmitting: boolean;
  isEnabled: boolean;
}) {
  return (
    <VStack fontSize="xl">
      {isEnabled === false && (
        <>
          <Text>2차인증이 활성화 되어있지 않습니다.</Text>
          <Text>
            OTP프로그램을 열고, 아래 QR코드를 인식한 후 나타나는 6자리 숫자
            코드를 입력하시면 2차인증 활성화가 마무리됩니다.
          </Text>
          <Box w="15vw" h="20vh" bgColor="blue.200">
            대충 QR 코드 나타날 곳
          </Box>
          <TwoFAInput isSubmitting={isSubmitting} />
        </>
      )}
      {isEnabled === true && (
        <>
          <Text>
            2차인증이 활성화 되었습니다. 해제하려면 OTP 인증을 한 번 더
            수행하십시오.
          </Text>
          <TwoFAInput isSubmitting={isSubmitting} />
        </>
      )}
    </VStack>
  );
}

function OTPRevise() {
  const value = '123456';
  const [isEnabled, setIsEnabled] = useState(false);
  const onSubmitHandler = React.useCallback(
    (values: CodeValueType, actions: FormikHelpers<CodeValueType>) => {
      setTimeout(() => {
        actions.setSubmitting(false);
        if (values.code === value) {
          setIsEnabled(!isEnabled);
          actions.resetForm();
        }
      }, 500);
    },
    [isEnabled],
  );

  return (
    <RoutedModal>
      <Formik
        initialValues={{ code: '' }}
        onSubmit={onSubmitHandler}
        validationSchema={CreateChannelScheme}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader>
              Two factor Management
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <OTPBody isSubmitting={isSubmitting} isEnabled={isEnabled} />
            </ModalBody>
          </Form>
        )}
      </Formik>
    </RoutedModal>
  );
}

export default OTPRevise;
