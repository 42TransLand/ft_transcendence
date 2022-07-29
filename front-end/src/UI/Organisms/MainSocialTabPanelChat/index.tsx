import React from 'react';
import { HStack, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import PopoverButton from '../PopoverButton';
import SearchBar from '../../Atoms/SearchBar';
import ElementList from '../ElementList';
import ChannelElement from '../../Molecules/ChannelElement';

function ChatTab() {
  return (
    <VStack w="100%">
      <HStack w="100%">
        <PopoverButton icon={<AddIcon />}>hello</PopoverButton>
        <SearchBar />
      </HStack>
      <ElementList>
        <ChannelElement
          isProtected
          channelName="Protected Channel"
          currentHeadCount={20}
          maxHeadCount={30}
        />
        <ChannelElement
          isProtected={false}
          channelName="Public Channel"
          currentHeadCount={30}
          maxHeadCount={50}
        />
      </ElementList>
    </VStack>
  );
}

export default ChatTab;
