import React from 'react';
import { Button } from '@chakra-ui/react';
import LoginBody from '../../Templates/LoginBody';

export default function Login() {
  return (
    <LoginBody>
      <a href="http://localhost:3000/auth/42">
        <Button colorScheme="gray" size="lg">
          LOGIN
        </Button>
      </a>
    </LoginBody>
  );
}
