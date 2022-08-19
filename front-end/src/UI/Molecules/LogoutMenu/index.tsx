import React from 'react';
import { GoSignOut } from 'react-icons/go';
import { MenuItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../../Hooks/useLogout';
import { SocketState, useSocket } from '../../../Hooks/useSocket';

export default function LogoutMenu() {
  const navigate = useNavigate();
  const logout = useLogout();
  const { state, dispatch } = useSocket();
  React.useEffect(() => {
    if (state.socketState === SocketState.DISCONNECTED) {
      logout();
      navigate('/', { replace: true });
    }
  }, [state.socketState, logout, navigate]);
  const handleMenuClick = React.useCallback(() => {
    dispatch({ action: 'disconnect' });
  }, [dispatch]);

  return (
    <MenuItem onClick={handleMenuClick} icon={<GoSignOut />}>
      로그아웃
    </MenuItem>
  );
}
