import React, { useEffect, useState } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  VStack,
  Box,
  Button,
  Image,
} from '@chakra-ui/react';
import { Buffer } from 'buffer';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import OTPInput from '../../Molecules/OTPInput';
import RoutedModal from '../../Templates/RoutedModal';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import useMe from '../../../Hooks/useMe';

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
  qr,
}: {
  isSubmitting: boolean;
  isEnabled: boolean;
  qr: string;
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
          <Box
            as={Image}
            src={qr}
            alt="No"
            w="15vw"
            h="20vh"
            bgColor="blue.200"
          />
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
  const queryClient = useQueryClient();
  const { tfaEnabled: isEnabled } = useMe();
  const { setError, WarningDialogComponent } = useWarningDialog();
  const onSubmitHandler = React.useCallback(
    (values: CodeValueType, actions: FormikHelpers<CodeValueType>) => {
      if (isEnabled === true) {
        axios
          .patch('tfa/turnOff')
          .then(() => {
            actions.setSubmitting(false);
            queryClient.invalidateQueries(['me']);
          })
          .catch((err) => {
            if (err.response) {
              setError({
                headerMessage: 'OTP해제 실패',
                bodyMessage: err.response.data.message,
              });
            } else {
              setError({
                headerMessage: 'OTP해제 실패',
                bodyMessage: '서버와의 연결이 원활하지 않습니다.',
              });
            }
            actions.setSubmitting(false);
          });
      } else if (isEnabled === false) {
        axios
          .post('tfa/turnOn', { code: values.code })
          .then(() => {
            actions.setSubmitting(false);
            queryClient.invalidateQueries(['me']);
          })
          .catch((err) => {
            if (err.response) {
              setError({
                headerMessage: 'OTP설정 실패',
                bodyMessage: err.response.data.message,
              });
            } else {
              setError({
                headerMessage: 'OTP설정 실패',
                bodyMessage: err.message,
              });
            }
            actions.setSubmitting(false);
          });
        actions.resetForm();
      }
    },
    [isEnabled, setError, queryClient],
  );

  const [img, setImg] = useState('');
  useEffect(() => {
    if (isEnabled === false) {
      axios
        .post('/tfa/generate', {}, { responseType: 'arraybuffer' })
        .then((res) => {
          setImg(
            `data:image/png;base64,${Buffer.from(res.data, 'binary').toString(
              'base64',
            )}`,
          );
        });
    }
  }, [isEnabled]);

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
              <OTPBody
                isSubmitting={isSubmitting}
                isEnabled={isEnabled}
                qr={img}
              />
            </ModalBody>
          </Form>
        )}
      </Formik>
      {WarningDialogComponent}
    </RoutedModal>
  );
}

export default OTPRevise;
