import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Flex, HStack, VStack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import SearchBar from '../../Atoms/SearchBar';
import FriendElement from '../../Molecules/FriendElement';
import FriendSearch from '../../Templates/FriendSearch';
import UserContextMenu from '../../Templates/UserContextMenu';
import ElementList from '../ElementList';
import PopoverButton from '../PopoverButton';
import FRIEND_GET from '../../../Queries/Friends/All';
import { useSocket } from '../../../Hooks/useSocket';

function FriendTab() {
  const [pattern, setPattern] = React.useState('');
  const { data, isLoading, error } = useQuery(FRIEND_GET);
  const friends = React.useMemo(() => {
    if (isLoading || error) {
      return [];
    }
    return data;
  }, [data, isLoading, error]);
  const socket = useSocket();

  return (
    <VStack>
      <HStack w="full">
        <Flex>
          <PopoverButton icon={<AddIcon />}>
            <FriendSearch />
          </PopoverButton>
        </Flex>
        <SearchBar setPattern={setPattern} />
      </HStack>
      <ElementList>
        {friends
          .filter((f) => f.nickname.includes(pattern))
          .map((f) => (
            <UserContextMenu
              key={f.id}
              target={f.id}
              targetName={f.nickname}
              mode="friend"
            >
              <FriendElement
                userName={f.nickname}
                userProfileImage={`${process.env.REACT_APP_API_HOST}/${f.profileImg}`}
                connectionStatus={socket.state.friendState[f.id]}
              />
            </UserContextMenu>
          ))}
      </ElementList>
    </VStack>
  );
}

export default FriendTab;
