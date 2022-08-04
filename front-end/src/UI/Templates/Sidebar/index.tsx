/*
 * https://chakra-templates.dev/navigation/sidebar
 */

import React from 'react';
import {
  IconButton,
  CloseButton,
  Flex,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';
import ScrollableVStack from '../../Atoms/ScrollableVStack';

interface MobileProps extends FlexProps {
  onOpen: () => void;
  header: React.ReactElement;
}
interface SidebarProps extends BoxProps {
  onClose: () => void;
  sidebar: React.ReactElement;
}

function SidebarContent({ display, onClose, sidebar, w }: SidebarProps) {
  return (
    <ScrollableVStack display={display} w={w} justifyContent="flex-start">
      <Flex
        h="20"
        display={{ base: 'flex', lg: 'none' }}
        alignItems="center"
        mx="5"
        justifyContent="space-between"
        flex={1}
      >
        <CloseButton display={{ base: 'flex', lg: 'none' }} onClick={onClose} />
      </Flex>
      {sidebar}
    </ScrollableVStack>
  );
}

function MobileNav({ onOpen, display, header }: MobileProps) {
  return (
    <Flex w="full" display={display}>
      <Flex height="20" alignItems="center" justifyContent="flex-start">
        <IconButton
          variant="outline"
          onClick={onOpen}
          aria-label="open menu"
          icon={<FiMenu />}
          mr="1.25em"
        />
        {header}
      </Flex>
    </Flex>
  );
}

export default function Sidebar({
  children,
  header,
  sidebar,
}: {
  children: React.ReactNode;
  header: React.ReactElement;
  sidebar: React.ReactElement;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <VStack justifyContent="flex-start">
      <MobileNav
        display={{ base: 'flex', lg: 'none' }}
        onOpen={onOpen}
        header={header}
      />
      <HStack h="full" alignItems="flex-start" justifyContent="space-between">
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent p="1em">
            <SidebarContent onClose={onClose} sidebar={sidebar} />
          </DrawerContent>
        </Drawer>
        <SidebarContent
          w={{ base: '0', lg: '25%' }}
          display={{ base: 'none', lg: 'block' }}
          onClose={() => onClose}
          sidebar={sidebar}
        />
        <Flex w={{ base: 'full', lg: '75%' }}>{children}</Flex>
      </HStack>
    </VStack>
  );
}
