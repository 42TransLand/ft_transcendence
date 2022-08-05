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

export interface TwoFAProps {
  isSubmitting: boolean;
}

function TwoFAInput(TwoFAprops: TwoFAProps) {
  const { isSubmitting } = TwoFAprops;

  return (
    <>
      <InputGroup w="50%" size="lg">
        <Field
          as={Input}
          pr="4.5rem"
          name="code"
          textColor="black"
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

export default TwoFAInput;
