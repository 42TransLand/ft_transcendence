import React from 'react';
import { HStack, Icon, Tab, Text } from '@chakra-ui/react';
import { IconType } from 'react-icons';

export default function TabListElement({
  icon,
  label,
}: {
  icon: IconType;
  label: string;
}) {
  return (
    <Tab>
      <HStack>
        <Icon as={icon} />
        <Text>{label}</Text>
      </HStack>
    </Tab>
  );
}
