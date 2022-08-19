import React, { useState } from 'react';
import {
  Box,
  Avatar,
  VStack,
  Input,
  AvatarBadge,
  InputGroup,
  InputRightElement,
  Button,
  Icon,
  Text,
  Center,
  Image,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { HiPencilAlt } from 'react-icons/hi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IoMdSave } from 'react-icons/io';
import axios from 'axios';
import USERS_ME_GET from '../../../Queries/Users/Me';
import useWarningDialog from '../../../Hooks/useWarningDialog';

type ChangeNameProps = {
  submitName: string;
};

const ChangeNameScheme = Yup.object().shape({
  submitName: Yup.string().required('닉네임을 입력해주세요.'),
});

export default function InitialSetup() {
  const { data } = useQuery(USERS_ME_GET);
  const { nickname, profileImg } = data ?? {
    nickname: 'undefined',
    profileImg: '',
  };
  const [inputName, setInputName] = useState(nickname);
  const queryClient = useQueryClient();
  const { setError, WarningDialogComponent } = useWarningDialog();

  const onSubmitHandler = React.useCallback(
    (
      { submitName }: ChangeNameProps,
      helper: FormikHelpers<ChangeNameProps>,
    ) => {
      axios
        .patch('/users/me', { nickname: submitName })
        .then(() => {
          setInputName(submitName);
          queryClient.invalidateQueries(['me']);
          helper.setSubmitting(false);
        })
        .catch(() => {
          helper.setSubmitting(false);
        });
    },
    [queryClient],
  );

  const imageFormRef = React.useRef<HTMLInputElement>(null);
  const onClickHandler = React.useCallback(() => {
    imageFormRef.current?.click();
  }, [imageFormRef]);
  const onChangeHandler = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('file', file);
      axios
        .patch('/users/me', formData)
        .then(() => {
          queryClient.invalidateQueries(['me']);
        })
        .catch((err) => {
          if (err.response) {
            setError({
              headerMessage: '이미지 변경 실패',
              bodyMessage: err.response.data.message,
            });
          } else {
            setError({
              headerMessage: '이미지 변경 실패',
              bodyMessage: err.message,
            });
          }
        });
    },
    [queryClient, setError],
  );
  const onCommitHandler = React.useCallback(() => {
    // TODO: 첫번째 로그인 비활성화 API 호출
    axios.patch('/users/me', { commit: true }).then(() => {
      queryClient.invalidateQueries(['me']);
    });
  }, [queryClient]);

  return (
    <Center w="100%" h="100vh">
      <VStack h="100%" justifyContent="center">
        <Image src="logo.svg" alt="Atomic Pong" mb="4em" />
        <Box boxSize="sm" p={10}>
          <Avatar
            src={`${process.env.REACT_APP_API_HOST}/${profileImg}`}
            size="full"
          >
            <AvatarBadge borderWidth={0}>
              <Box>
                <Box
                  as={Button}
                  position="relative"
                  height="100%"
                  width="100%"
                  transform="translate(-10%, -15%)"
                  fontSize="6xl"
                  onClick={onClickHandler}
                  cursor="pointer"
                  borderRadius="full"
                  textColor="black"
                  p={2}
                >
                  <HiPencilAlt />
                </Box>
                <Input
                  type="file"
                  accept="image/*"
                  ref={imageFormRef}
                  onChange={onChangeHandler}
                  style={{ display: 'none' }}
                />
              </Box>
            </AvatarBadge>
          </Avatar>
        </Box>
        <Box width="xs">
          <Formik
            initialValues={{ submitName: inputName }}
            onSubmit={onSubmitHandler}
            validationSchema={ChangeNameScheme}
          >
            {({ isSubmitting }) => (
              <Form>
                <InputGroup>
                  <Field
                    as={Input}
                    name="submitName"
                    variant="flushed"
                    textColor="white"
                    size="lg"
                  />
                  <InputRightElement>
                    <Button type="submit" isLoading={isSubmitting}>
                      <Icon as={IoMdSave} boxSize="1.5em" />
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Text fontSize="xs" textColor="red.500">
                  <ErrorMessage name="submitName" />
                </Text>
              </Form>
            )}
          </Formik>
        </Box>
        <Center pt="3em">
          <Button onClick={onCommitHandler}>설정 완료</Button>
        </Center>
      </VStack>
      {WarningDialogComponent}
    </Center>
  );
}
