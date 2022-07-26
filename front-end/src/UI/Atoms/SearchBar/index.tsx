import React from 'react';
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

function SearchBar() {
  return (
    <InputGroup size="xs">
      <Input size="xs" />
      <InputRightElement>
        <Button size="xs">
          <SearchIcon />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
}

export default SearchBar;
