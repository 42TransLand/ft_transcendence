import React from 'react';
import { Box, ChakraProvider } from '@chakra-ui/react';
import Login from './UI/Pages/Login';

function App() {
  return (
    <ChakraProvider>
      <Box color="#000">
        <Login />
      </Box>
    </ChakraProvider>
  );
}

export default App;
