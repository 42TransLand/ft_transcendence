import React from 'react';
import { GoSignOut } from 'react-icons/go';
import { MenuItem } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../../Hooks/useLogout';

export default function LogoutMenu() {
  const navigate = useNavigate();
  const logout = useLogout();
  const handleMenuClick = React.useCallback(() => {
    logout();
    navigate('/', { replace: true });
  }, [navigate, logout]);

  return (
    <MenuItem onClick={handleMenuClick} icon={<GoSignOut />}>
      로그아웃
    </MenuItem>
  );
}
