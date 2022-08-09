import React from 'react';
import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie, setCookie } from 'typescript-cookie';
import Main from './UI/Pages/Main';
import Game from './UI/Pages/Game';
import Login from './UI/Pages/Login';
import { SocketProvider } from './Hooks/useSocket';
import USERS_ME_GET from './Queries/Users/Me';
import Loading from './UI/Templates/Loading';

function App() {
  React.useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_WEBSOCKET_HOST;
    axios.defaults.withCredentials = true;
  }, []);
  const [authCookie, setAuthCookie] = React.useState(
    getCookie('Authentication'),
  );
  const { error, isLoading } = useQuery(USERS_ME_GET);

  if (!authCookie) {
    return (
      <ChakraProvider theme={theme}>
        <Login />
      </ChakraProvider>
    );
  }
  if (isLoading) {
    return (
      <ChakraProvider theme={theme}>
        <Loading message="정보를 불러오는 중입니다." />
      </ChakraProvider>
    );
  }
  if (error) {
    setCookie('Authentication', '', { path: '/' });
    setAuthCookie('');
  }
  return (
    <ChakraProvider theme={theme}>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/game" element={<Game />} />
            <Route path="/*" element={<Main />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </ChakraProvider>
  );
}

export default App;
