import React from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroup,
  Input,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { Routes, Route } from 'react-router-dom';
import Profile from '../../Pages/Profile';
import ChatModalContext from './ChatModalContext';
import RoutedModal from '../../Templates/RoutedModal';
import ChatBody from '../ChatBody';
import ChatHeader from '../ChatHeader';
import InputMessageProps from './InputMessageProps';

export default function ChatModal({
  onSubmitHandler,
  leaveChatRoomHandler,
}: {
  onSubmitHandler: (
    values: InputMessageProps,
    helper: FormikHelpers<InputMessageProps>,
  ) => void;
  leaveChatRoomHandler?: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <RoutedModal
      closeOnOverlayClick={false}
      leaveChatRoomHandler={leaveChatRoomHandler}
    >
      <ModalHeader display={{ base: 'none', lg: 'flex' }}>
        <ChatHeader />
      </ModalHeader>
      <ModalBody ref={ref} pb={6}>
        <ChatModalContext.Provider value={ref}>
          <ChatBody />
        </ChatModalContext.Provider>
      </ModalBody>
      <ModalFooter>
        <Formik initialValues={{ message: '' }} onSubmit={onSubmitHandler}>
          {({ isSubmitting }) => (
            <Form style={{ width: '100%' }}>
              <InputGroup size="lg">
                <Field
                  name="message"
                  as={Input}
                  pr="4.5rem"
                  textColor="black"
                  placeholder=""
                />
                <InputRightElement width="3rem">
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    colorScheme="gray"
                    size="1.5em"
                    p={1}
                  >
                    <ArrowBackIcon boxSize="1.5em" />
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Form>
          )}
        </Formik>
      </ModalFooter>
      <Routes>
        <Route path="/user/:name" element={<Profile />} />
      </Routes>
    </RoutedModal>
  );
}

ChatModal.defaultProps = {
  leaveChatRoomHandler: undefined,
};
