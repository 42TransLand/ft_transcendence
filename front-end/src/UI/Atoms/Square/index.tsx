/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Center } from '@chakra-ui/react';

export default function Square({ children }: { children: React.ReactNode }) {
  return (
    <Center minHeight="100%" style={{ aspectRatio: '1' }}>
      {children}
    </Center>
  );
}
