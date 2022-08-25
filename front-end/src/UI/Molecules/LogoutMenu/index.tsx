import React from 'react';
import { GoSignOut } from 'react-icons/go';
import { MenuItem } from '@chakra-ui/react';
import { useLogout } from '../../../Hooks/useLogout';

export default function LogoutMenu() {
  const logout = useLogout();

  return (
    <MenuItem onClick={logout} icon={<GoSignOut />}>
      로그아웃
    </MenuItem>
  );
}
