import { VStack } from '@chakra-ui/react';
import styled from 'styled-components';

const ScrollableVStack = styled(VStack)`
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    width: '8px';
  }
  &::-webkit-scrollbar-thumb {
    background: '#aaa';
    border-radius: '24px';
  }
  overflow: visible;
  overflow-y: auto;
`;

export default ScrollableVStack;
