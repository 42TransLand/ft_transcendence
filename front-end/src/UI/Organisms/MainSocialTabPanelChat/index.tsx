import React from 'react';
import { Link } from 'react-router-dom';
import { HStack, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import styled from 'styled-components';
import PopoverButton from '../PopoverButton';
import SearchBar from '../../Atoms/SearchBar';
import ElementList from '../ElementList';
import ChannelElement from '../../Molecules/ChannelElement';
import CreateChannel from '../../Molecules/CreateChannel';

const ChannelLink = styled(Link)`
  width: 100%;
`;

function ChatTab() {
  return (
    <VStack w="100%">
      <HStack w="100%">
        <PopoverButton icon={<AddIcon />}>
          <CreateChannel />
        </PopoverButton>
        <SearchBar />
      </HStack>
      <ElementList>
        <ChannelLink to="/chat/1">
          <ChannelElement
            roomType="protected"
            channelName="비번 걸려있는데 누가 과연 여기에 들어올 것인가?"
            currentHeadCount={20}
            maxHeadCount={30}
          />
        </ChannelLink>
        <ChannelLink to="/chat/2">
          <ChannelElement
            roomType="public"
            channelName="엄준식 죽었잖아요"
            currentHeadCount={30}
            maxHeadCount={50}
          />
        </ChannelLink>
      </ElementList>
    </VStack>
  );
}

export default ChatTab;
