import React from 'react';
import { HStack, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import SearchBar from '../../Atoms/SearchBar';
import PopoverButton from '../PopoverButton';
import ElementList from '../ElementList';
import FriendElement from '../../Molecules/FriendElement';
import UserContextMenu from '../../Templates/UserContextMenu';
import FriendSearch from '../../Molecules/FriendSearch';

function FriendTab() {
  return (
    <VStack w="100%">
      <HStack w="100%">
        <PopoverButton icon={<AddIcon />}>
          <FriendSearch />
        </PopoverButton>
        <SearchBar />
      </HStack>
      <ElementList>
        <UserContextMenu mode="friend">
          <FriendElement userName="Kanye West" connectionStatus="online" />
        </UserContextMenu>
        <UserContextMenu mode="chat">
          <FriendElement userName="Erling Haaland" connectionStatus="offline" />
        </UserContextMenu>
        <FriendElement userName="Benjamin Button" connectionStatus="ingame" />
      </ElementList>
    </VStack>
  );
}

export default FriendTab;
