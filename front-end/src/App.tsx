import React from 'react';
import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie, setCookie } from 'typescript-cookie';
import Main from './UI/Pages/Main';
import Game from './UI/Pages/Game';
import Login from './UI/Pages/Login';
import { SocketProvider } from './Hooks/useSocket';
import USERS_ME_GET from './Queries/Users/Me';
import Loading from './UI/Templates/Loading';
import { LogoutProvider } from './Hooks/useLogout';
import useMe from './Hooks/useMe';

function App() {
  React.useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_HOST;
    axios.defaults.withCredentials = true;
  }, []);
  const [authCookie, setAuthCookie] = React.useState(
    getCookie('Authentication'),
  );
  const { nickname } = useMe();
  const { error, isLoading } = useQuery(USERS_ME_GET);
  const logout = React.useCallback(() => {
    setCookie('Authentication', '', { path: '/' });
    setAuthCookie('');
  }, [setAuthCookie]);

  if (!authCookie) {
    return (
      <ChakraProvider theme={theme}>
        <Box backgroundColor="#000">
          <Login />
        </Box>
      </ChakraProvider>
    );
  }
  if (isLoading) {
    return (
      <ChakraProvider theme={theme}>
        <Box backgroundColor="#000">
          <Loading message="정보를 불러오는 중입니다." />
        </Box>
      </ChakraProvider>
    );
  }
  if (error) {
    logout();
  }
  return (
    <LogoutProvider callback={logout}>
      <ChakraProvider theme={theme}>
        <Box backgroundColor="#000">
          <SocketProvider nickname={nickname}>
            <BrowserRouter>
              <Routes>
                <Route path="/game" element={<Game />} />
                <Route path="/*" element={<Main />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        </Box>
      </ChakraProvider>
    </LogoutProvider>
  );
}

export default App;
