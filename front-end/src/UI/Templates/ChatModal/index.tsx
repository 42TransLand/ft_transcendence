import React, { useCallback } from 'react';
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
import { Formik, Form, Field, FormikHelpers } from 'formik';
import axios from 'axios';
import RoutedModal from '../RoutedModal';
import ChatHeader from '../../Organisms/ChatHeader';
import ChatBody from '../../Organisms/ChatBody';
// import { useChat } from '../../../Hooks/useChat';
import useToastedChat from '../../../Hooks/useToastedChat';
import useMe from '../../../Hooks/useMe';
import Profile from '../../Pages/Profile';
import ChatModalContext from './ChatModalContext';
import useDM from '../../../Hooks/useDM';
// import { ValueTarget } from 'framer-motion';

export default function ChatModal(props: { isDM: boolean }) {
  const { isDM } = props;
  // const [, dispatch] = useChat();
  // const dispatchMessage = isDM ? useDM() : useToastedChat();
  const dispatchDM = useDM();
  const { nickname } = useMe();
  const { userName } = useParams();
  const targetName: string = userName ?? '';
  useToastedChat(nickname);
  const ref = React.useRef<HTMLDivElement>(null);

  const onSubmitHandlerDM = useCallback(
    (
      values: { message: string },
      helper: FormikHelpers<{ message: string }>,
    ) => {
      const { message } = values;
      if (message.length === 0) return;
      axios
        .post(`/dm/send/${targetName}`, { content: message })
        .catch((err) => {
          console.log(err);
        });
      dispatchDM(nickname, message);
      helper.resetForm();
    },
    [dispatchDM, nickname, targetName],
  );

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
          onSubmit={
            isDM
              ? onSubmitHandlerDM
              : () => {
                  console.log('소통해요');
                }
          }
        >
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
