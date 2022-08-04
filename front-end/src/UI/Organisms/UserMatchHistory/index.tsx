import React from 'react';
import { Box } from '@chakra-ui/react';
import UserMatch from '../../Molecules/UserMatch';
import ElementList from '../ElementList';

function UserMatchHistory() {
  return (
    <Box width="100%" height="100%" borderWidth="1px" borderRadius="md">
      <ElementList>
        <UserMatch
          opponentUserName="YuriMyWife"
          opponentUserIamge={undefined}
          userScore={10}
          opponentScore={8}
          isRankedGame
          isNormalMode
        />
        <UserMatch
          opponentUserName="PAKA"
          opponentUserIamge={undefined}
          userScore={6}
          opponentScore={10}
          isRankedGame={false}
          isNormalMode
        />
        <UserMatch
          opponentUserName="YuriMyWife"
          opponentUserIamge={undefined}
          userScore={10}
          opponentScore={8}
          isRankedGame
          isNormalMode
        />
      </ElementList>
    </Box>
  );
}

export default UserMatchHistory;
