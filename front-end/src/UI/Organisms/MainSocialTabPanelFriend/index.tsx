import React from 'react';
import { HStack, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import SearchBar from '../../Atoms/SearchBar';
import PopoverButton from '../PopoverButton';
import ElementList from '../ElementList';
import FriendElement from '../../Molecules/FriendElement';

function FriendTab() {
  return (
    <VStack w="100%">
      <HStack w="100%">
        <PopoverButton icon={<AddIcon />}>hello</PopoverButton>
        <SearchBar />
      </HStack>
      <ElementList>
        <FriendElement userName="Kanye West" connectionStatus="online" />
        <FriendElement userName="Erling Haaland" connectionStatus="offline" />
        <FriendElement userName="Benjamin Button" connectionStatus="ingame" />
      </ElementList>
    </VStack>
  );
}

export default FriendTab;
