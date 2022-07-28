import React from 'react';
import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './UI/Pages/Main';
import Game from './UI/Pages/Game';
import Login from './UI/Pages/Login';
import { SocketProvider } from './Hooks/useSocket';

function App() {
  // TODO
  const user = {}; // = useQuery(GET_USER);

  return (
    <ChakraProvider theme={theme}>
      <Box backgroundColor="#000">
        {user === null ? (
          <Login />
        ) : (
          <SocketProvider>
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
