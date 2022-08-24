import React from 'react';
import { Flex, HStack, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import PopoverButton from '../PopoverButton';
import SearchBar from '../../Atoms/SearchBar';
import ElementList from '../ElementList';
import ChannelElement from '../../Molecules/ChannelElement';
import CreateChannel from '../../Templates/CreateChannel';
import CHANNEL_GET from '../../../Queries/Channels/All';
import ChannelProps from '../../../Props/ChannelProps';
import ProtectedChannelElement from '../../Molecules/ProtectedChannelElement';

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
          .map((c: ChannelProps) =>
            c.type === 'PROTECT' ? (
              <ProtectedChannelElement
                key={c.id}
                roomType={c.type}
                channelName={c.name}
                currentHeadCount={c.count}
                chatRoomId={c.id}
              />
            ) : (
              <ChannelElement
                key={c.id}
                roomType={c.type}
                channelName={c.name}
                currentHeadCount={c.count}
                chatRoomId={c.id}
              />
            ),
          )}
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
