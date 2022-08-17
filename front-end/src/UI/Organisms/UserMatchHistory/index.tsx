import React from 'react';
import { Box } from '@chakra-ui/react';
import UserMatch from '../../Molecules/UserMatch';
import ElementList from '../ElementList';
import RecordProps from '../../../Props/RecordProps';

function UserMatchHistory(props: { records: RecordProps[]; userName: string }) {
  const { records, userName } = props;

  return (
    <Box
      width="100%"
      height="100%"
      borderWidth="1px"
      borderRadius="md"
      overflowY="scroll"
    >
      <ElementList>
        {records?.map((record) =>
          userName === record.winUserNickname ? (
            <UserMatch
              key={record.id}
              opponentUserName={record.loseUserNickname}
              opponentUserImage={`${process.env.REACT_APP_API_HOST}/${record.loseUserProfileImg}`}
              userScore={record.winUserScore}
              opponentScore={record.loseUserScore}
              isRankedGame={record.isLadder}
              isNormalMode={record.type === 'CLASSIC'}
            />
          ) : (
            <UserMatch
              key={record.id}
              opponentUserName={record.winUserNickname}
              opponentUserImage={`${process.env.REACT_APP_API_HOST}/${record.winUserProfileImg}`}
              userScore={record.loseUserScore}
              opponentScore={record.winUserScore}
              isRankedGame={record.isLadder}
              isNormalMode={record.type === 'CLASSIC'}
            />
          ),
        )}
        ;
      </ElementList>
    </Box>
  );
}

export default UserMatchHistory;
