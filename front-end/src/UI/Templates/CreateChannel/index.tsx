import React from 'react';
import axios from 'axios';
import { ChatIcon } from '@chakra-ui/icons';
import { Grid, GridItem, VStack, Input, Button, Text } from '@chakra-ui/react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import useWarningDialog from '../../../Hooks/useWarningDialog';

type CreateChannelProps = {
  name: string;
  password: string;
};

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
  const queryClient = useQueryClient();
  const onSubmitHandler = React.useCallback(
    (
      { name, password }: CreateChannelProps,
      actions: FormikHelpers<CreateChannelProps>,
    ) => {
      axios
        .post('/chat/create', {
          name,
          type: password.length ? 'PROTECT' : 'PUBLIC', // TODO
          password: password ?? '',
        })
        .then((response) => {
          actions.resetForm();
          actions.setSubmitting(false);
          queryClient.invalidateQueries(['channels']);
          navigate(`/chat/${response.data}`);
        })
        .catch((err) => {
          if (err.response) {
            setError({
              headerMessage: '채널 생성 실패',
              bodyMessage: err.response.data.message,
            });
          } else {
            setError({
              headerMessage: '채널 생성 실패',
              bodyMessage: err.message,
            });
          }
          actions.setSubmitting(false);
        });
    },
    [setError, navigate, queryClient],
  );

  return (
    <Formik
      initialValues={{ name: '', password: '' }}
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
