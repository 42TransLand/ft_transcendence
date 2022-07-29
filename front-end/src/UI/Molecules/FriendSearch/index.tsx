import React from 'react';
import { HStack, Input, VStack } from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

function FriendSearch() {
  const [value, setValue] = React.useState('');
  return (
    <div>
      <HStack>
        <Search2Icon fontSize={40} />
        <VStack width="100%">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search Friend"
          />
        </VStack>
      </HStack>
    </div>
  );
}

export default FriendSearch;
