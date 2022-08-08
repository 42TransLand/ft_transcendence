import React from 'react';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Formik, Form, FormikValues } from 'formik';

function SearchBar({
  setPattern,
}: {
  setPattern: React.Dispatch<React.SetStateAction<string>>;
}) {
  const onSubmitHandler = React.useCallback(
    (values: FormikValues) => {
      setPattern(values.keyword);
    },
    [setPattern],
  );

  return (
    <Formik onSubmit={onSubmitHandler} initialValues={{}}>
      <Form>
        <InputGroup size="xs">
          <Input size="xs" />
          <InputRightElement>
            <Button type="submit" size="xs">
              <SearchIcon />
            </Button>
          </InputRightElement>
        </InputGroup>
      </Form>
    </Formik>
  );
}

export default SearchBar;
