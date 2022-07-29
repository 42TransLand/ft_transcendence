import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import MainSocial from '../../Templates/MainSocial';
import MainStandby from '../../Templates/MainStandby';
import { SocketState, useSocket } from '../../../Hooks/useSocket';
import Loading from '../../Templates/Loading';

function Main() {
  const { state } = useSocket();
  if (process.env.REACT_APP_WEBSOCKET_REQUIRED === 'true') {
    switch (state.socketState) {
      case SocketState.CONNECTING:
        return <Loading message="서버에 접속중..." />;
      case SocketState.CONNECT_ERROR:
        return <Loading message="서버에 연결하지 못했습니다." />;
      case SocketState.DISCONNECTED:
        return <Loading message="서버와 연결이 끊어졌습니다." />;
      default:
        break;
    }
  }

  return (
    <Flex minH="100vh" maxH="100vh">
      <Box width="full" margin="auto">
        <MainStandby />
      </Box>
      <Box minW="400px" maxW="400px" maxH="100vh" bgColor="white">
        <MainSocial />
      </Box>
    </Flex>
  );
}

export default Main;
