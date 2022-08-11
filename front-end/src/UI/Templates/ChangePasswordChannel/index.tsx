import React from 'react';
import { LockIcon } from '@chakra-ui/icons';
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
import useWarningDialog from '../../../Hooks/useWarningDialog';

const ChangePasswordChannelScheme = Yup.object().shape({
  password: Yup.string().max(
    100,
    '입장 비밀번호는 100자를 초과할 수 없습니다.',
  ),
});

function ChangePasswordChannel() {
  const { setError, WarningDialogComponent } = useWarningDialog();
  const onSubmitHandler = React.useCallback(
    (values: FormikValues, actions: FormikHelpers<FormikValues>) => {
      setTimeout(() => {
        setError({
          headerMessage: '비밀번호 변경 실패',
          bodyMessage: '입장 비밀번호를 변경하는데에 실패했습니다.',
        });
        actions.setSubmitting(false);
      }, 1000);
    },
    [setError],
  );

  return (
    <Formik
      initialValues={{}}
      onSubmit={onSubmitHandler}
      validationSchema={ChangePasswordChannelScheme}
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
                <LockIcon fontSize={40} />
              </GridItem>
              <GridItem rowSpan={2} colSpan={5}>
                <VStack align="baseline">
                  <Field
                    as={Input}
                    variant="flushed"
                    name="password"
                    type="password"
                    placeholder="변경할 입장 패스워드"
                    my="0"
                  />
                  <Text
                    fontSize="xs"
                    textColor="red.500"
                    mt="0!important"
                    pb="12px"
                  >
                    <ErrorMessage name="password" />
                  </Text>
                </VStack>
              </GridItem>
              <GridItem rowSpan={2} colSpan={4} />
              <GridItem rowSpan={1} colSpan={2}>
                <Button
                  type="submit"
                  colorScheme="gray"
                  width="100%"
                  isLoading={isSubmitting}
                >
                  변경하기
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

export default ChangePasswordChannel;
