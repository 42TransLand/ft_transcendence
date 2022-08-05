import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Formik, Form, Field } from 'formik';
import RoutedModal from '../RoutedModal';
import ChatHeader from '../../Organisms/ChatHeader';
import ChatBody from '../../Organisms/ChatBody';
import RoutedModalExample from '../../Pages/RoutedModalExample';
import { useChat } from '../../../Hooks/useChat';
import useToastedChat from '../../../Hooks/useToastedChat';

export default function ChatModal() {
  const [, dispatch] = useChat();
  useToastedChat('엄준식은살아있다');

  return (
    <RoutedModal closeOnOverlayClick={false}>
      <ModalHeader display={{ base: 'none', lg: 'flex' }}>
        <ChatHeader />
      </ModalHeader>
      <ModalBody pb={6}>
        <ChatBody />
      </ModalBody>
      <ModalFooter>
        <Formik
          initialValues={{ message: '' }}
          onSubmit={(values, { resetForm }) => {
            const { message } = values;
            if (message.length === 0) return;
            dispatch({
              action: 'chat',
              name: '엄준식은살아있다',
              message,
            });
            resetForm();
          }}
        >
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
                <Button type="submit" colorScheme="gray" size="1.5em" p={1}>
                  <ArrowBackIcon boxSize="1.5em" />
                </Button>
              </InputRightElement>
            </InputGroup>
          </Form>
        </Formik>
      </ModalFooter>
      <Routes>
        <Route path="/example/:name" element={<RoutedModalExample />} />
      </Routes>
    </RoutedModal>
  );
}
