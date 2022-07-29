import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import MainSocial from '../../Templates/MainSocial';
import MainStandby from '../../Templates/MainStandby';
import { SocketState, useSocket } from '../../../Hooks/useSocket';
import Loading from '../../Templates/Loading';

function Main() {
  const { state } = useSocket();
  if (process.env.REACT_APP_WEBSOCKET_REQUIRED === 'true') {
    if (state.socketState !== SocketState.CONNECTED) {
      if (state.socketState === SocketState.CONNECTING) {
        return <Loading message="서버에 접속중..." />;
      }
      return (
        <Loading message="서버에 연결하지 못했습니다. 나중에 다시 시도하세요." />
      );
    }
  }

  return (
    <Flex minH="100vh" maxH="100vh">
      <Box width="full" margin="auto">
        <MainStandby />
      </Box>
      <Box minW="400px" maxW="400px" maxH="100vh" bgColor="teal.200">
        <MainSocial />
      </Box>
    </Flex>
  );
}

export default Main;
