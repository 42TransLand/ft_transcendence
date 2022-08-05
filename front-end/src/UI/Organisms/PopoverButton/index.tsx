import React from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  IconButton,
  PopoverCloseButton,
  IconButtonProps,
  PopoverProps,
  PopoverContentProps,
} from '@chakra-ui/react';

function PopoverButton(props: {
  icon: IconButtonProps['icon'];
  children: React.ReactNode;
  iconSize?: IconButtonProps['size'];
  placement?: PopoverProps['placement'];
  w?: PopoverContentProps['w'];
  h?: PopoverContentProps['h'];
  transparent?: boolean | undefined;
}) {
  const {
    icon: ButtonIcon,
    children,
    iconSize,
    placement,
    w,
    h,
    transparent,
  } = props;
  const transparentProps = transparent
    ? {
        backgroundColor: 'transparent',
        _hover: { backgroundColor: 'transparent' },
        _active: { backgroundColor: 'transparent' },
      }
    : {};

  return (
    <Popover placement={placement}>
      <PopoverTrigger>
        <IconButton
          size={iconSize}
          aria-label="PopoverTrigger"
          icon={ButtonIcon}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...transparentProps}
        />
      </PopoverTrigger>
      <PopoverContent
        paddingX={5}
        paddingTop={10}
        paddingBottom={5}
        w={w}
        h={h}
      >
        <PopoverArrow />
        <PopoverCloseButton />
        {children}
      </PopoverContent>
    </Popover>
  );
}

export default PopoverButton;

PopoverButton.defaultProps = {
  iconSize: 'sm',
  placement: 'left',
  w: '420px',
  h: '340px',
  transparent: false,
};
