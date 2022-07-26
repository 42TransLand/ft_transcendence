import React from 'react';
import { /* Box,  */ ChakraProvider, theme } from '@chakra-ui/react';
// import Login from './UI/Pages/Login';
import Main from './UI/Pages/Main';

function App() {
  return (
    <ChakraProvider theme={theme}>
      {/* <Box color="#000">
        <Login />
      </Box> */}
      <Main />
    </ChakraProvider>
  );
}

export default App;
