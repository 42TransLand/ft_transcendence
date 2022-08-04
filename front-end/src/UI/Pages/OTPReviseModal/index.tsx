import React, { useState } from 'react';
import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  Text,
  Button,
  VStack,
  InputGroup,
  Input,
  InputRightElement,
  Box,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import RoutedModal from '../../Templates/RoutedModal';

function NotEnabledBody({ handleClick }: { handleClick: () => void }) {
  return (
    <VStack fontSize="xl">
      <Text>2차인증이 활성화 되어있지 않습니다.</Text>
      <Text>
        OTP프로그램을 열고, 아래 QR코드를 인식한 후 나타나는 6자리 숫자 코드를
        입력하시면 2차인증 활성화가 마무리됩니다.
      </Text>
      <Box w="15vw" h="20vh" bgColor="blue.200">
        대충 QR 코드 나타날 곳
      </Box>
      <InputGroup w="50%" size="lg">
        <Input pr="4.5rem" textColor="white" placeholder="6 digit code" />
        <InputRightElement width="3rem">
          <Button colorScheme="gray" size="sm" onClick={handleClick}>
            <ArrowBackIcon />
          </Button>
        </InputRightElement>
      </InputGroup>
    </VStack>
  );
}

function EnabledBody({ handleClick }: { handleClick: () => void }) {
  return (
    <VStack fontSize="xl">
      <Text>
        2차인증이 활성화 되었습니다. 해제하려면 OTP 인증을 한 번 더
        수행하십시오.
      </Text>
      <InputGroup w="50%" size="lg">
        <Input pr="4.5rem" textColor="white" placeholder="6 digit code" />
        <InputRightElement width="3rem">
          <Button colorScheme="gray" size="sm" onClick={handleClick}>
            <ArrowBackIcon />
          </Button>
        </InputRightElement>
      </InputGroup>
    </VStack>
  );
}

function OTPReviseModal() {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleClick = (password: string) => {
    if (isEnabled) setIsEnabled(!isEnabled);
    else if (password === '123456') setIsEnabled(!isEnabled);
  };

  return (
    <RoutedModal>
      <ModalHeader>
        Two factor Management
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        {isEnabled === true && <EnabledBody handleClick={handleClick} />}
        {isEnabled === false && <NotEnabledBody handleClick={handleClick} />}
      </ModalBody>
    </RoutedModal>
  );
}

export default OTPReviseModal;
