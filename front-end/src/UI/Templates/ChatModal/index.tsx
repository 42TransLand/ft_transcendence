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
import RoutedModal from '../RoutedModal';
import ChatHeader from '../../Organisms/ChatHeader';
import ChatBody from '../../Organisms/ChatBody';
import RoutedModalExample from '../../Pages/RoutedModalExample';

export default function ChatModal() {
  return (
    <RoutedModal closeOnOverlayClick={false}>
      <ModalHeader display={{ base: 'none', lg: 'flex' }}>
        <ChatHeader />
      </ModalHeader>
      <ModalBody pb={6}>
        <ChatBody />
      </ModalBody>
      <ModalFooter>
        <InputGroup size="lg">
          <Input pr="4.5rem" textColor="black" placeholder="" />
          <InputRightElement width="3rem">
            <Button colorScheme="gray" size="1.5em" p={1}>
              <ArrowBackIcon boxSize="1.5em" />
            </Button>
          </InputRightElement>
        </InputGroup>
      </ModalFooter>
      <Routes>
        <Route path="/example/:name" element={<RoutedModalExample />} />
      </Routes>
    </RoutedModal>
  );
}
