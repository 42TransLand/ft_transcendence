import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
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
import axios from 'axios';
import RoutedModal from '../RoutedModal';
import ChatHeader from '../../Organisms/ChatHeader';
import ChatBody from '../../Organisms/ChatBody';
import { useChat } from '../../../Hooks/useChat';
import useToastedChat from '../../../Hooks/useToastedChat';
import useMe from '../../../Hooks/useMe';
import Profile from '../../Pages/Profile';
import ChatModalContext from './ChatModalContext';

export default function ChatModal() {
  const [, dispatch] = useChat();
  const { nickname } = useMe();
  const { userName } = useParams();
  const targetName: string = userName ?? '';
  useToastedChat(nickname);
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <RoutedModal closeOnOverlayClick={false}>
      <ModalHeader display={{ base: 'none', lg: 'flex' }}>
        <ChatHeader />
      </ModalHeader>
      <ModalBody ref={ref} pb={6}>
        <ChatModalContext.Provider value={ref}>
          <ChatBody />
        </ChatModalContext.Provider>
      </ModalBody>
      <ModalFooter>
        <Formik
          initialValues={{ message: '' }}
          onSubmit={(values, { resetForm }) => {
            const { message } = values;
            if (message.length === 0) return;
            axios
              .post(`/sendDM/${targetName}`, { message })
              .then((response) => {
                console.log(response);
              })
              .catch((err) => {
                console.log(err);
              });
            dispatch({
              action: 'chat',
              name: nickname,
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
        <Route path="/user/:name" element={<Profile />} />
      </Routes>
    </RoutedModal>
  );
}
