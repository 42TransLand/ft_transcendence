import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import MainSocial from '../../Templates/MainSocial';
import MainStandby from '../../Templates/MainStandby';
import { useSocket } from '../../../Hooks/useSocket';
import Loading from '../../Templates/Loading';

function Main() {
  const { state } = useSocket();
  if (state.socket === null) {
    return <Loading message="서버에 접속중..." />;
  }

  return (
    <Flex minH="100vh">
      <Box width="full" margin="auto">
        <MainStandby />
      </Box>
      <Box minW="425px" maxW="425px" bgColor="teal.200">
        <MainSocial />
      </Box>
    </Flex>
  );
}

export default Main;
