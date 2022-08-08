import React from 'react';
import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'typescript-cookie';
import Main from './UI/Pages/Main';
import Game from './UI/Pages/Game';
import Login from './UI/Pages/Login';
import { SocketProvider } from './Hooks/useSocket';

function App() {
  React.useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_WEBSOCKET_HOST;
    axios.defaults.withCredentials = true;
  }, []);
  const cookie = React.useMemo(() => getCookie('Authentication'), []);
  const { data } = useQuery(['user'], async () => axios.get('/users/me'));
  console.log(data);

  return (
    <ChakraProvider theme={theme}>
      <Box backgroundColor="#000">
        {!cookie ? (
          <Login />
        ) : (
          <SocketProvider query={{ id: data?.data.id }}>
            <BrowserRouter>
              <Routes>
                <Route path="/game" element={<Game />} />
                <Route path="/*" element={<Main />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;
