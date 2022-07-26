import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import MainSocial from '../../Templates/MainSocial';
import MainStandby from '../../Templates/MainStandby';

function Main() {
  return (
    <Flex minH="100vh">
      <Box width="full" minW="550px" bgColor="green.300">
        <MainStandby />
      </Box>
      <Box minW="425px" maxW="425px" bgColor="teal.200">
        <MainSocial />
      </Box>
    </Flex>
  );
}

export default Main;
