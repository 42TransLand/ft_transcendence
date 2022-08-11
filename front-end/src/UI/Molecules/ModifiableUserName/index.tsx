import React, { useState } from 'react';
import {
  Text,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { IoMdSave } from 'react-icons/io';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import axios from 'axios';
import useWarningDialog from '../../../Hooks/useWarningDialog';

type ChangeNameProps = {
  nickname: string;
};

const ChangeNameScheme = Yup.object().shape({
  nickname: Yup.string().required('닉네임을 입력해주세요.'),
});

function ModifiableUserName(props: { userName: string; isMyself: boolean }) {
  const { userName, isMyself } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [modUserName, setModUserName] = useState(userName);
  const { setError, WarningDialogComponent } = useWarningDialog();

  const onSubmitHandler = React.useCallback(
    ({ nickname }: ChangeNameProps, helper: FormikHelpers<ChangeNameProps>) => {
      axios
        .patch('/users/me', { nickname })
        .then(() => {
          setModUserName(nickname);
          setIsEditing(false);
          helper.setSubmitting(false);
        })
        .catch((err) => {
          if (err.response.status === 409) {
            setError({
              headerMessage: '닉네임 변경 실패',
              bodyMessage: '중복된 닉네임입니다.',
            });
          }
          helper.setSubmitting(false);
        });
    },
    [setModUserName, setIsEditing, setError],
  );

  if (!isMyself) {
    return <Text fontSize="3xl">{userName}</Text>;
  }
  return isEditing ? (
    <Formik
      initialValues={{ nickname: modUserName }}
      onSubmit={onSubmitHandler}
      validationSchema={ChangeNameScheme}
    >
      {({ isSubmitting }) => (
        <>
          <Form>
            <InputGroup>
              <Field as={Input} name="nickname" variant="flushed" size="lg" />
              <InputRightElement>
                <Button type="submit" isLoading={isSubmitting}>
                  <Icon as={IoMdSave} boxSize="1.5rem" />
                </Button>
              </InputRightElement>
            </InputGroup>
            <Text fontSize="xs" textColor="red.500">
              <ErrorMessage name="nickname" />
            </Text>
          </Form>
          {WarningDialogComponent}
        </>
      )}
    </Formik>
  ) : (
    <Text
      onClick={() => {
        setIsEditing(true);
      }}
      cursor="pointer"
      fontSize="5xl"
    >
      {modUserName}
    </Text>
  );
}

export default ModifiableUserName;
