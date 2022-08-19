import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './UI/Pages/Main';
import Game from './UI/Pages/Game';
import Login from './UI/Pages/Login';
import { SocketProvider } from './Hooks/useSocket';
import Loading from './UI/Templates/Loading';
import Error from './UI/Templates/Error';
import { LogoutProvider } from './Hooks/useLogout';
import useMe from './Hooks/useMe';
import InitialSetup from './UI/Pages/InitialSetup';
import { AppStatus, useApp } from './Hooks/useApp';
import OTPLogin from './UI/Pages/OTPLogin';

function App() {
  const { status, logout } = useApp();
  const { nickname } = useMe();

  if (status === AppStatus.NeedLogin) {
    return <Login />;
  }
  if (status === AppStatus.NowLoading) {
    return <Loading message="정보를 불러오는 중입니다." />;
  }
  if (status === AppStatus.NeedInitialSetup) {
    return <InitialSetup />;
  }
  if (status === AppStatus.Error) {
    return <Error message="서버와 통신 중 오류가 발생했습니다." />;
  }
  if (status === AppStatus.NeedOTPLogin) {
    return <OTPLogin />;
  }

  return (
    <LogoutProvider callback={logout}>
      <SocketProvider nickname={nickname}>
        <BrowserRouter>
          <Routes>
            <Route path="/game" element={<Game />} />
            <Route path="/*" element={<Main />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </LogoutProvider>
  );
}

export default App;
