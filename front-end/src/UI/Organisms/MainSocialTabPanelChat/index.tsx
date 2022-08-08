import React from 'react';
import { Link } from 'react-router-dom';
import { HStack, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import styled from 'styled-components';
import PopoverButton from '../PopoverButton';
import SearchBar from '../../Atoms/SearchBar';
import ElementList from '../ElementList';
import ChannelElement from '../../Molecules/ChannelElement';
import CreateChannel from '../../Templates/CreateChannel';

const ChannelLink = styled(Link)`
  width: 100%;
`;

const channels = [
  {
    roomId: 1,
    roomType: 'protected' as 'protected',
    channelName: '비번 걸려있는데 누가 과연 여기에 들어올 것인가?',
    currentHeadCount: 20,
    maxHeadCount: 30,
  },
  {
    roomId: 2,
    roomType: 'public' as 'public',
    channelName: '엄준식 죽었잖아요',
    currentHeadCount: 30,
    maxHeadCount: 50,
  },
];

function ChatTab() {
  const [pattern, setPattern] = React.useState('');

  return (
    <VStack w="100%">
      <HStack w="100%">
        <PopoverButton icon={<AddIcon />}>
          <CreateChannel />
        </PopoverButton>
        <SearchBar setPattern={setPattern} />
      </HStack>
      <ElementList>
        {channels
          .filter((c) => c.channelName.includes(pattern))
          .map((c) => (
            <ChannelLink to={`/chat/${c.roomId}`}>
              <ChannelElement
                roomType={c.roomType}
                channelName={c.channelName}
                currentHeadCount={c.currentHeadCount}
                maxHeadCount={c.maxHeadCount}
              />
            </ChannelLink>
          ))}
      </ElementList>
    </VStack>
  );
}

export default ChatTab;
