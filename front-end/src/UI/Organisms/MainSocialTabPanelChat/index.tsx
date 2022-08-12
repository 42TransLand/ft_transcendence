import React from 'react';
import { Link } from 'react-router-dom';
import { Flex, HStack, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import PopoverButton from '../PopoverButton';
import SearchBar from '../../Atoms/SearchBar';
import ElementList from '../ElementList';
import ChannelElement from '../../Molecules/ChannelElement';
import CreateChannel from '../../Templates/CreateChannel';
import CHANNEL_GET from '../../../Queries/Channels/All';
import ChannelProps from '../../../Props/ChannelProps';

const ChannelLink = styled(Link)`
  width: 100%;
`;

function ChatTab() {
  const [pattern, setPattern] = React.useState('');
  const { data, isLoading, error } = useQuery(CHANNEL_GET);
  const channels = data ?? [];
  let channelContent;

  if (isLoading) {
    channelContent = <div>Loading...</div>;
  } else if (error) {
    channelContent = <div>Error!</div>;
  } else {
    channelContent = (
      <ElementList>
        {channels
          .filter((c: ChannelProps) => c.name.includes(pattern))
          .map((c: ChannelProps) => (
            <ChannelLink key={c.id} to={`/chat/${c.id}`}>
              <ChannelElement
                roomType={c.type}
                channelName={c.name}
                /* currentHeadCount={c.currentHeadCount}
                maxHeadCount={c.maxHeadCount} */
              />
            </ChannelLink>
          ))}
      </ElementList>
    );
  }

  return (
    <VStack>
      <HStack w="full">
        <Flex>
          <PopoverButton h={210} icon={<AddIcon />} placement="right-start">
            <CreateChannel />
          </PopoverButton>
        </Flex>
        <SearchBar setPattern={setPattern} />
      </HStack>
      {channelContent}
    </VStack>
  );
}

export default ChatTab;
