import React from 'react';
import { Button, Center } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
// import LoginBody from '../LoginBody';

function MainStandby() {
  return (
    <Center>
      <Link to="/game?mode=match-making">
        <Button colorScheme="gray" size="lg">
          LADDER GAME
        </Button>
      </Link>
    </Center>
  );
}

export default MainStandby;
