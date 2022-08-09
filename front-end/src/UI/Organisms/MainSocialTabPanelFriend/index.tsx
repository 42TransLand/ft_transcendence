import React from 'react';
import { HStack, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import SearchBar from '../../Atoms/SearchBar';
import FriendElement from '../../Molecules/FriendElement';
import FriendSearch from '../../Templates/FriendSearch';
import UserContextMenu from '../../Templates/UserContextMenu';
import ElementList from '../ElementList';
import PopoverButton from '../PopoverButton';

const friends = [
  { userId: 1, userName: 'Kanye West', conenctionStatus: 'online' },
  { userId: 2, userName: 'Erling Haaland', conenctionStatus: 'offline' },
  { userId: 3, userName: 'Benjamin Button', conenctionStatus: 'ingame' },
];

function FriendTab() {
  const [pattern, setPattern] = React.useState('');

  return (
    <VStack w="100%">
      <HStack w="100%">
        <PopoverButton icon={<AddIcon />}>
          <FriendSearch />
        </PopoverButton>
        <SearchBar setPattern={setPattern} />
      </HStack>
      <ElementList>
        {friends
          .filter((f) => f.userName.includes(pattern))
          .map((f) => (
            <UserContextMenu
              key={f.userId}
              target={f.userId}
              targetName={f.userName}
              mode="friend"
            >
              <FriendElement
                userName={f.userName}
                connectionStatus={f.conenctionStatus}
              />
            </UserContextMenu>
          ))}
      </ElementList>
    </VStack>
  );
}

export default FriendTab;
