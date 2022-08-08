import React from 'react';
import { Button } from '@chakra-ui/react';
import LoginBody from '../../Templates/LoginBody';

export default function Login() {
  return (
    <LoginBody>
      <Button colorScheme="gray" size="lg">
        LOGIN
      </Button>
    </LoginBody>
  );
}
