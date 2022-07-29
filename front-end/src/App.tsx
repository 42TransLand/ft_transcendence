import React from 'react';
import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './UI/Pages/Main';
import Game from './UI/Pages/Game';
import Login from './UI/Pages/Login';
import { SocketProvider } from './Hooks/useSocket';

function App() {
  // https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
  // 브라우저 자체적으로 URL 주소를 파싱하기 위한 임시 처리임. 나중에는 필요 없을 예정.
  function getQueryVariable(variable: string) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i += 1) {
      const pair = vars[i].split('=');
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1]);
      }
    }
    return undefined;
  }
  // TODO
  const user = { id: getQueryVariable('user') }; // = useQuery(GET_USER);

  return (
    <ChakraProvider theme={theme}>
      <Box backgroundColor="#000">
        {user === null ? (
          <Login />
        ) : (
          <SocketProvider query={{ user: user.id }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/game" element={<Game />} />
              </Routes>
            </BrowserRouter>
          </SocketProvider>
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;
