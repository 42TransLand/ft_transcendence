import React, { ReactElement } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  IconButton,
  PopoverCloseButton,
} from '@chakra-ui/react';

function PopoverButton(props: {
  InternalComponent: () => ReactElement;
  ButtonIcon: React.ReactElement;
}) {
  const { InternalComponent, ButtonIcon } = props;

  return (
    <Popover placement="left">
      <PopoverTrigger>
        <IconButton size="sm" aria-label="PopoverTrigger" icon={ButtonIcon} />
      </PopoverTrigger>
      <PopoverContent padding={5}>
        <PopoverArrow />
        <PopoverCloseButton />
        <InternalComponent />
      </PopoverContent>
    </Popover>
  );
}

export default PopoverButton;
