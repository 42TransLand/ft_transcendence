import React from 'react';
import axios from 'axios';
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
import { useNavigate } from 'react-router-dom';
import useWarningDialog from '../../../Hooks/useWarningDialog';

const CreateChannelScheme = Yup.object().shape({
  name: Yup.string()
    .required('채널명이 필요합니다.')
    .min(4, '채녈명은 4글자 이상이어야 합니다.')
    .max(20, '채널명은 20글자 이하이어야 합니다.'),
  password: Yup.string().max(
    100,
    '입장 비밀번호는 100자를 초과할 수 없습니다.',
  ),
});

function CreateChannel() {
  const { setError, WarningDialogComponent } = useWarningDialog();
  const navigate = useNavigate();
  const onSubmitHandler = React.useCallback(
    (values: FormikValues, actions: FormikHelpers<FormikValues>) => {
      axios
        .post('/chat/create', {
          name: values.name,
          type: values.password.length ? 'PROTECT' : 'PUBLIC', // TODO
          password: values.password,
        })
        .then((response) => {
          console.log(response);
          actions.setSubmitting(false);
          navigate(`/chat/${response.data}`);
        })
        .catch((err) => {
          if (err.response.status === 500) {
            setError({
              headerMessage: '채널 생성 실패',
              bodyMessage: '채널 생성에 실패했습니다.',
            });
            actions.setSubmitting(false);
          }
        });
    },
    [setError, navigate],
  );

  return (
    <Formik
      initialValues={{}}
      onSubmit={onSubmitHandler}
      validationSchema={CreateChannelScheme}
    >
      {({ isSubmitting }) => (
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
                  isLoading={isSubmitting}
                >
                  채널 생성
                </Button>
              </GridItem>
            </Grid>
          </Form>
          {WarningDialogComponent}
        </>
      )}
    </Formik>
  );
}

export default CreateChannel;
