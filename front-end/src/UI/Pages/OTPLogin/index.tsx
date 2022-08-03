import React from 'react';
import {
  InputGroup,
  InputRightElement,
  Button,
  Input,
  Text,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import LoginBody from '../../Templates/LoginBody';

function OTPLogin() {
  return (
    <LoginBody>
      <Text color="white" fontSize="4xl">
        <b>Authentication Code를 입력하세요</b>
      </Text>
      <InputGroup size="lg">
        <Input pr="4.5rem" textColor="white" placeholder="6 digit code" />
        <InputRightElement width="3rem">
          <Button colorScheme="gray" size="sm">
            <ArrowBackIcon />
          </Button>
        </InputRightElement>
      </InputGroup>
    </LoginBody>
  );
}

export default OTPLogin;
