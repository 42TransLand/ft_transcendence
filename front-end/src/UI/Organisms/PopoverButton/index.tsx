import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  IconButton,
  PopoverCloseButton,
} from '@chakra-ui/react';

function PopoverButton(props: {
  icon: React.ReactElement;
  children: React.ReactNode;
}) {
  const { icon: ButtonIcon, children } = props;

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <IconButton size="sm" aria-label="PopoverTrigger" icon={ButtonIcon} />
      </PopoverTrigger>
      <PopoverContent paddingX={5} paddingTop={10} w="400px" h="300px">
        <PopoverArrow />
        <PopoverCloseButton />
        {children}
      </PopoverContent>
    </Popover>
  );
}

export default PopoverButton;
