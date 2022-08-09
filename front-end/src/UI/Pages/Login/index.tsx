import React from 'react';
import { Button } from '@chakra-ui/react';
import LoginBody from '../../Templates/LoginBody';

export default function Login() {
  return (
    <LoginBody>
      <a href={`${process.env.REACT_APP_API_HOST}/auth/42`}>
        <Button colorScheme="gray" size="lg">
          LOGIN
        </Button>
      </a>
    </LoginBody>
  );
}
