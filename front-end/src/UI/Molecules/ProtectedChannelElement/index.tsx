import React from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import ChannelElement from '../ChannelElement';
import ChannelType from '../../../Props/ChannelType';
import {
  ChatStateRequestType,
  useChatState,
} from '../../../Hooks/useChatState';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required('비밀번호를 입력해주세요.')
    .min(3, '입장 비밀번호는 3자 이상이어야 합니다.')
    .max(10, '입장 비밀번호는 10자를 초과할 수 없습니다.'),
});

function PasswordValidation(props: { chatRoomId: string }) {
  const { chatRoomId } = props;
  const navigate = useNavigate();
  const { setRequest } = useChatState();
  const onSubmitHandler = React.useCallback(
    (
      { password }: { password: string },
      helper: FormikHelpers<{ password: string }>,
    ) => {
      setRequest({ type: ChatStateRequestType.JOIN, password: { password } });
      helper.resetForm();
      helper.setSubmitting(false);
      navigate(`/chat/${chatRoomId}`);
    },
    [chatRoomId, navigate, setRequest],
  );
  return (
    <Formik
      initialValues={{ password: '' }}
      onSubmit={onSubmitHandler}
      validationSchema={validationSchema}
    >
      {({ isSubmitting }) => (
        <Form>
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
          <Button
            type="submit"
            colorScheme="gray"
            width="100%"
            isLoading={isSubmitting}
          >
            채널 입장
          </Button>
        </Form>
      )}
    </Formik>
  );
}

function ProtectedChannelElement(props: {
  roomType: ChannelType.PUBLIC | ChannelType.PROTECT;
  channelName: string;
  currentHeadCount: number;
  chatRoomId: string;
}) {
  const { roomType, channelName, currentHeadCount, chatRoomId } = props;
  return (
    <Flex width="full">
      <Popover placement="left">
        <PopoverTrigger>
          <Button
            h="4em"
            w="full"
            colorScheme="teal"
            variant="none"
            fontWeight={0}
            padding={0}
          >
            <Box w="full">
              <ChannelElement
                roomType={roomType}
                channelName={channelName}
                currentHeadCount={currentHeadCount}
                chatRoomId={chatRoomId}
              />
            </Box>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PasswordValidation chatRoomId={chatRoomId} />
        </PopoverContent>
      </Popover>
    </Flex>
  );
}

export default ProtectedChannelElement;
