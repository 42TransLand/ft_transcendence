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
import { useTargetUser } from '../../../Hooks/useTargetUser';

function InviteGameMenu({ isRendered }: { isRendered: boolean }) {
  const { userName } = useTargetUser();
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    if (isOpen && !isRendered) setIsOpen(false);
  }, [isOpen, isRendered, setIsOpen]);

  return (
    <Popover
      placement="left"
      closeOnBlur={false}
      isOpen={isOpen && isRendered}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
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
          h="320px"
        >
          <PopoverCloseButton />
          <InviteGame nickname={userName} />
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

export default InviteGameMenu;
