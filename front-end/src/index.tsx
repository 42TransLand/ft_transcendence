import React from 'react';
import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Assets/fonts/fonts.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>
      <Box backgroundColor="#000">
        <App />
      </Box>
    </ChakraProvider>
  </QueryClientProvider>,
);
