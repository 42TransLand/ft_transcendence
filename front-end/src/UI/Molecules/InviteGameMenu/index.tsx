import React from 'react';
import {
  MenuItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  Text,
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
      <PopoverContent
        paddingX={5}
        paddingTop={10}
        paddingBottom={5}
        w="420px"
        h="280px"
      >
        <PopoverArrow />
        <PopoverCloseButton />
        <InviteGame />
      </PopoverContent>
    </Popover>
  );
}

export default InviteGameMenu;
