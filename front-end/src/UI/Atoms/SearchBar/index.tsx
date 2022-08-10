import React from 'react';
import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Box,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Formik, Form, FormikValues } from 'formik';

function SearchBar({
  setPattern,
}: {
  setPattern: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onSubmitHandler = React.useCallback(
    (values: FormikValues) => {
      setPattern(values.target.value);
    },
    [setPattern],
  );

  return (
    <Formik onSubmit={onSubmitHandler} initialValues={{}}>
      <Box w="100%">
        <Form>
          <InputGroup w="100%" size="2xl">
            <Input size="2xl" onChange={onSubmitHandler} />
            <InputRightElement>
              <Button type="submit" size="xs">
                <SearchIcon />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Form>
      </Box>
    </Formik>
  );
}

export default SearchBar;
