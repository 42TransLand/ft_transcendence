/* eslint-disable */
import React from 'react';
import { MenuItem, Text } from '@chakra-ui/react';
import { MdSmartDisplay } from 'react-icons/md';
import useWarningDialog from '../../../Hooks/useWarningDialog';
import { useSocket } from '../../../Hooks/useSocket';
import SocketEventName from '../../../WebSockets/dto/constants/socket.events.enum';
import GameSpectateResDto from '../../../WebSockets/dto/res/game.spectate.res.dto';
import GameTicket from '../../../WebSockets/dto/constants/game.ticket.enum';
import { useNavigate } from 'react-router-dom';

function SpectateMenu(props: { targetName: string }) {
  const { targetName } = props;
  const { setError, WarningDialogComponent } = useWarningDialog();
  const { state, dispatch } = useSocket();
  const navigate = useNavigate();

  const onClickHandler = () => {
    state.socket?.emit(SocketEventName.GAME_SPECTATE_REQ, {
      nickname: targetName,
    });
  };

  React.useEffect(() => {
    state.socket?.on(
      SocketEventName.GAME_SPECTATE_RES,
      (dto: GameSpectateResDto) => {
        if (dto.success) {
          dispatch({
            action: 'setCustomGame',
            gameState: {
              ticket: GameTicket.SPECTATE,
              opponentNickname: targetName,
            },
          });
          navigate('/game?mode=spectate');
        }
        if (dto.error) {
          setError({ headerMessage: 'Error', bodyMessage: dto.error });
        }
      },
    );
    return () => {
      state.socket?.off(SocketEventName.GAME_SPECTATE_RES);
    };
  }, [state.socket]);

  return (
    <>
      <MenuItem onClick={onClickHandler} icon={<MdSmartDisplay />}>
        <Text>관전하기</Text>
      </MenuItem>
      {WarningDialogComponent}
    </>
  );
}

export default SpectateMenu;
