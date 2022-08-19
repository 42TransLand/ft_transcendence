import React from 'react';
import {
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Text,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { ErrorMessage, Field } from 'formik';

export interface OTPProps {
  isSubmitting: boolean;
  size: string;
  textColor: string;
}

function OTPInput(otpProps: OTPProps) {
  const { isSubmitting, size, textColor } = otpProps;

  return (
    <>
      <InputGroup w={size} size="lg">
        <Field
          as={Input}
          pr="4.5rem"
          name="code"
          textColor={textColor}
          placeholder="6 digit code"
        />
        <InputRightElement width="3rem">
          <Button
            type="submit"
            colorScheme="gray"
            size="sm"
            isLoading={isSubmitting}
          >
            <ArrowBackIcon />
          </Button>
        </InputRightElement>
      </InputGroup>
      <Text fontSize="xs" textColor="red.500">
        <ErrorMessage name="code" />
      </Text>
    </>
  );
}

export default OTPInput;
