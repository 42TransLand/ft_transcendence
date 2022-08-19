import React, { useState } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  VStack,
  Box,
  Button,
} from '@chakra-ui/react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import OTPInput from '../../Molecules/OTPInput';
import RoutedModal from '../../Templates/RoutedModal';

export const OTPInputScheme = Yup.object().shape({
  code: Yup.string()
    .required('6자리 코드를 입력해주세요.')
    .typeError('6자리 코드를 입력해주세요.')
    .min(6, '6자리 코드를 입력해주세요.')
    .max(6, '6자리 코드를 입력해주세요.'),
});

const EmptyScheme = Yup.object();

export type CodeValueType = {
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
          <OTPInput size="30%" textColor="black" isSubmitting={isSubmitting} />
        </>
      )}
      {isEnabled === true && (
        <>
          <Text>
            2차인증이 활성화 되었습니다. 해제하려면 OTP 인증을 한 번 더
            수행하십시오.
          </Text>
          <Button colorScheme="red" type="submit" isLoading={isSubmitting}>
            Disable
          </Button>
        </>
      )}
    </VStack>
  );
}

function OTPRevise() {
  const tempKey = '123456';
  const [isEnabled, setIsEnabled] = useState(false);
  const onSubmitHandler = React.useCallback(
    (values: CodeValueType, actions: FormikHelpers<CodeValueType>) => {
      setTimeout(() => {
        if (isEnabled === true) {
          setIsEnabled(false);
        } else if (isEnabled === false && values.code === tempKey) {
          setIsEnabled(!isEnabled);
          actions.resetForm();
        }
        actions.setSubmitting(false);
      }, 500);
    },
    [isEnabled],
  );

  return (
    <RoutedModal>
      <Formik
        initialValues={{ code: '' }}
        onSubmit={onSubmitHandler}
        validationSchema={isEnabled ? EmptyScheme : OTPInputScheme}
      >
        {({ isSubmitting }) => (
          <Form>
            <ModalHeader>
              OTP Management
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
