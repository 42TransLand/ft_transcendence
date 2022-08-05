/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import { ChatIcon } from '@chakra-ui/icons';
import { Grid, GridItem, VStack, Input, Button, Text } from '@chakra-ui/react';
import {
  ErrorMessage,
  Field,
  Form,
  Formik,
  FormikHelpers,
  FormikValues,
} from 'formik';
import * as Yup from 'yup';
import WarningAlertDialog from '../../Atoms/WarningAlertDialog';

const CreateChannelScheme = Yup.object().shape({
  name: Yup.string()
    .required('채널명이 필요합니다.')
    .min(4, '채녈명은 4글자 이상이어야 합니다.')
    .max(20, '채널명은 20글자 이하이어야 합니다.'),
  max: Yup.number()
    .typeError('최대 인원을 정수로 입력해주세요.')
    .integer('최대 인원을 정수로 입력해주세요.')
    .required('최대 인원을 입력해 주세요.')
    .min(2, '방의 최대 인원은 적어도 2명이어야 합니다.')
    .max(100, '방의 최대 인원은 100을 초과할 수 없습니다.'),
  password: Yup.string().max(
    100,
    '입장 비밀번호는 100자를 초과할 수 없습니다.',
  ),
});

function CreateChannel() {
  const [error, setError] = React.useState({
    headerMessage: '',
    bodyMessage: '',
  });
  const onSubmitHandler = React.useCallback(
    (values: FormikValues, actions: FormikHelpers<FormikValues>) => {
      setTimeout(() => {
        setError({
          headerMessage: '채널 생성 실패',
          bodyMessage: '이미 존재하는 채널명입니다.',
        });
        actions.setSubmitting(false);
      }, 1000);
    },
    [],
  );
  const cancelRef = React.useRef(null); // TODO: 삭제하기

  return (
    <Formik
      initialValues={{}}
      onSubmit={onSubmitHandler}
      validationSchema={CreateChannelScheme}
    >
      {(props) => (
        <>
          <Form>
            <Grid
              h="full"
              w="full"
              templateRows="reapeat(4, 1fr)"
              templateColumns="repeat(6, 1fr)"
            >
              <GridItem rowSpan={1} colSpan={1}>
                <ChatIcon fontSize={40} />
              </GridItem>
              <GridItem rowSpan={3} colSpan={5}>
                <VStack align="baseline">
                  <Field
                    as={Input}
                    variant="flushed"
                    name="name"
                    placeholder="채널 이름"
                  />
                  <Text fontSize="xs" textColor="red.500">
                    <ErrorMessage name="name" />
                  </Text>
                  <Field
                    as={Input}
                    variant="flushed"
                    name="max"
                    placeholder="최대 인원"
                  />
                  <Text fontSize="xs" textColor="red.500">
                    <ErrorMessage name="max" />
                  </Text>
                  <Field
                    as={Input}
                    variant="flushed"
                    name="password"
                    type="password"
                    placeholder="입장 패스워드"
                  />
                  <Text fontSize="xs" textColor="red.500">
                    <ErrorMessage name="password" />
                  </Text>
                </VStack>
              </GridItem>
              <GridItem rowSpan={1} colSpan={4} />
              <GridItem rowSpan={1} colSpan={2}>
                <Button
                  type="submit"
                  colorScheme="gray"
                  width="100%"
                  // eslint-disable-next-line react/prop-types
                  isLoading={props.isSubmitting}
                >
                  채널 생성
                </Button>
              </GridItem>
            </Grid>
          </Form>
          <WarningAlertDialog
            isOpen={error.bodyMessage.length > 0}
            onClose={() => setError({ headerMessage: '', bodyMessage: '' })}
            cancelRef={cancelRef}
            headerMessage={error.headerMessage}
            bodyMessage={error.bodyMessage}
          />
        </>
      )}
    </Formik>
  );
}

export default CreateChannel;
