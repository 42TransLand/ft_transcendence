import React from 'react';
import { Box } from '@chakra-ui/react';
import UserMatch from '../../Molecules/UserMatch';
import ElementList from '../ElementList';

const matchHistories = [
  {
    matchId: 1,
    opponentUserName: '엄준식',
    opponentUserImage:
      'https://mblogthumb-phinf.pstatic.net/MjAyMDA2MTlfMTY5/MDAxNTkyNTAyNDM2ODcy.FVNsc1SOtS2sUfyaajXNhZpYzAKIFeUg_vCTqzHW4SIg.kQsV680NF1XfoVcDgPg64yF0RzHyRs0-raId3LTIIG4g.JPEG.wndyd75/hqdefault1.jpg?type=w2',
    userScore: 10,
    opponentScore: 8,
    isRankedGame: true,
    isNormalMode: true,
  },
  {
    matchId: 2,
    opponentUserName: 'PAKA',
    opponentUserImage:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/98bb53c3-4e2f-47f3-9c4b-6c0484b383f6-profile_image-300x300.png',
    userScore: 6,
    opponentScore: 10,
    isRankedGame: false,
    isNormalMode: true,
  },
  {
    matchId: 3,
    opponentUserName: 'YuriMyWife',
    opponentUserImage:
      'https://w.namu.la/s/cb44538b575f372318ce9c28cd806dde1e6ac146514283b57b696ad7226ca18971fdae5716367e639a3345594b8cdfbf119bcc971b7a686b17c0873402ad659d555a847603c4aa8462a6f783e206b9381a506042def4729ceb696cf6394d4db8',
    userScore: 10,
    opponentScore: 8,
    isRankedGame: true,
    isNormalMode: true,
  },
];

function UserMatchHistory() {
  return (
    <Box width="100%" height="100%" borderWidth="1px" borderRadius="md">
      <ElementList>
        {matchHistories.map((m) => (
          <UserMatch
            key={m.matchId}
            opponentUserName={m.opponentUserName}
            opponentUserImage={m.opponentUserImage}
            userScore={m.userScore}
            opponentScore={m.opponentScore}
            isRankedGame={m.isRankedGame}
            isNormalMode={m.isNormalMode}
          />
        ))}
        ;
      </ElementList>
    </Box>
  );
}

export default UserMatchHistory;
