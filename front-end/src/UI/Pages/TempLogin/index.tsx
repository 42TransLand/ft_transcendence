import React from 'react';
import { InputGroup, Input, InputRightElement, Button } from '@chakra-ui/react';
import LoginBody from '../../Templates/LoginBody';

export default function Login() {
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);

  return (
    <LoginBody>
      <InputGroup size="md">
        <Input pr="4.5rem" textColor="white" placeholder="Temporary ID" />
        <InputRightElement width="4.5rem">
          <Button colorScheme="gray" size="sm" onClick={handleClick}>
            LOGIN
          </Button>
        </InputRightElement>
      </InputGroup>
    </LoginBody>
  );
}
