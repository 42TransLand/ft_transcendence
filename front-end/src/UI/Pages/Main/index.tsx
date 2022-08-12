import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
import MainSocial from '../../Templates/MainSocial';
import MainStandby from '../../Templates/MainStandby';
import { SocketState, useSocket } from '../../../Hooks/useSocket';
import Loading from '../../Templates/Loading';
import OTPRevise from '../OTPRevise';
import Profile from '../Profile';
import Chat from '../Chat';
import useInvitation from '../../../Hooks/useInvitation';
import { SocketEventName } from '../../../Games/dto/constants/game.constants';
import GameMatchDto from '../../../Games/dto/req/game.match.dto';
import GameMode from '../../../Games/dto/constants/game.mode.enum';
import useWarningDialog from '../../../Hooks/useWarningDialog';

function Main() {
  const { state, dispatch } = useSocket();
  const clearSocketError = React.useCallback(() => {
    dispatch({
      action: 'setSocketError',
      error: { headerMessage: '', bodyMessage: '' },
    });
  }, [dispatch]);
  const { setError, WarningDialogComponent } = useWarningDialog(() => {
    clearSocketError();
  });
  const invite = useInvitation();
  const onInviteNotify = React.useCallback(
    (msg: GameMatchDto & { scoreForWin: number }) => {
      const gameMode =
        msg.gameMode === GameMode.CLASSIC ? '기본모드' : '스피드모드';
      invite(msg.opponentNickname, gameMode, msg.scoreForWin, false);
    },
    [invite],
  );
  React.useEffect(() => {
    if (state.socket) {
      state.socket.on(SocketEventName.GAME_INVITE_NOTIFY, onInviteNotify);
    }
    return () => {
      state.socket?.off(SocketEventName.GAME_INVITE_NOTIFY);
    };
  }, [state.socket, onInviteNotify]);
  React.useEffect(() => {
    if (state.socketError.headerMessage) {
      setError(state.socketError);
    }
    return () => clearSocketError();
  }, [state.socketError, clearSocketError, setError]);

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
    <Flex h="100vh" flexDirection={{ base: 'column', lg: 'row' }}>
      <Box
        display={{ base: 'flex', lg: 'flex' }}
        width="full"
        justifyContent="center"
      >
        <MainStandby />
      </Box>
      <Box
        minW={{ base: 'full', lg: '400px' }}
        maxW="400px"
        height="full"
        bgColor="white"
      >
        <MainSocial />
      </Box>
      <Routes>
        <Route path="/otp/:name" element={<OTPRevise />} />
        <Route path="/user/:name" element={<Profile />} />
        <Route path="/chat/:id/*" element={<Chat dm={false} />} />
        <Route path="/dm/:userName/*" element={<Chat dm />} />
      </Routes>
      {WarningDialogComponent}
    </Flex>
  );
}

export default Main;
