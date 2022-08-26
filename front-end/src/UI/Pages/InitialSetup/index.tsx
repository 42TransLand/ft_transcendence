import React, { useState } from 'react';
import {
  Box,
  Avatar,
  VStack,
  Input,
  AvatarBadge,
  Button,
  Text,
  Center,
  Image,
} from '@chakra-ui/react';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { HiPencilAlt } from 'react-icons/hi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import USERS_ME_GET from '../../../Queries/Users/Me';
import useWarningDialog from '../../../Hooks/useWarningDialog';

type InitialSetupProps = {
  submitName: string;
  image?: File;
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
  const [currentProfileImg, setCurrentProfileImg] = useState(
    `${process.env.REACT_APP_API_HOST}/${profileImg}`,
  );
  const [inputName, setInputName] = useState(nickname);
  const queryClient = useQueryClient();
  const { setError, WarningDialogComponent } = useWarningDialog();

  const onSubmitHandler = React.useCallback(
    (
      { submitName, image }: InitialSetupProps,
      helper: FormikHelpers<InitialSetupProps>,
    ) => {
      const formData = new FormData();
      if (image) formData.append('file', image);
      formData.append('nickname', submitName);
      axios
        .patch('/users/me', formData)
        .then(() => {
          setInputName(submitName);
          queryClient.invalidateQueries(['me']);
          helper.setSubmitting(false);
        })
        .catch((err) => {
          if (err.response) {
            setError({
              headerMessage: '사용자 설정 실패',
              bodyMessage: err.response.data.message,
            });
          } else {
            setError({
              headerMessage: '사용자 설정 실패',
              bodyMessage: err.message,
            });
          }
          helper.setSubmitting(false);
        });
    },
    [queryClient, setError],
  );

  const imageFormRef = React.useRef<HTMLInputElement>(null);
  const onClickHandler = React.useCallback(() => {
    imageFormRef.current?.click();
  }, [imageFormRef]);
  const onChangeHandler = React.useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean | undefined,
      ) => void,
    ) => {
      if (!e.target.files) return;
      setFieldValue('image', e.target.files[0]);
      setCurrentProfileImg(URL.createObjectURL(e.target.files[0]));
    },
    [],
  );
  return (
    <Formik
      initialValues={{ submitName: inputName }}
      onSubmit={onSubmitHandler}
      validationSchema={ChangeNameScheme}
    >
      {({ isSubmitting, setFieldValue }) => (
        <Center w="100%" h="100vh">
          <VStack h="100%" justifyContent="center">
            <Image src="/logo.svg" alt="Atomic Pong" mb="4em" />
            <Box boxSize="sm" p={10}>
              <Avatar src={currentProfileImg} size="full">
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
                      onChange={(e) => onChangeHandler(e, setFieldValue)}
                      style={{ display: 'none' }}
                    />
                  </Box>
                </AvatarBadge>
              </Avatar>
            </Box>
            <Form>
              <Box width="xs">
                <Field
                  as={Input}
                  name="submitName"
                  variant="flushed"
                  textColor="white"
                  size="lg"
                />
                <Text fontSize="xs" textColor="red.500">
                  <ErrorMessage name="submitName" />
                </Text>
              </Box>
              <Center pt="3em">
                <Button type="submit" isLoading={isSubmitting}>
                  설정 완료
                </Button>
              </Center>
            </Form>
          </VStack>
          {WarningDialogComponent}
        </Center>
      )}
    </Formik>
  );
}
