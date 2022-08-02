import React from 'react';
import {
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  Text,
  Portal,
} from '@chakra-ui/react';
import { IoGameController } from 'react-icons/io5';
import InviteGame from '../../Templates/InviteGame';

function InviteGameMenu() {
  return (
    <Popover placement="left" closeOnBlur={false}>
      <PopoverTrigger>
        <MenuItem icon={<IoGameController />}>
          <Text>게임초대</Text>
        </MenuItem>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          paddingX={5}
          paddingTop={10}
          paddingBottom={5}
          w="420px"
          h="280px"
        >
          <PopoverCloseButton />
          <InviteGame />
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

export default InviteGameMenu;
