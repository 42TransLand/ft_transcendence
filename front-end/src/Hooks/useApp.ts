import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getCookie, setCookie } from 'typescript-cookie';
import USERS_ME_GET from '../Queries/Users/Me';
import useMe from './useMe';

export enum AppStatus {
  NowLoading,
  Error,
  NeedLogin,
  NeedInitialSetup,
  Authenticated,
}

export function useApp() {
  React.useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_HOST;
    axios.defaults.withCredentials = true;
  }, []);
  const { error, isLoading } = useQuery({ ...USERS_ME_GET, retry: false });
  const [authCookie, setAuthCookie] = React.useState(
    getCookie('Authentication'),
  );
  const logout = React.useCallback(() => {
    setCookie('Authentication', '', { path: '/' });
    setAuthCookie('');
  }, [setAuthCookie]);
  const { id: firstLogin } = useMe();
  const status = React.useMemo(() => {
    if (!authCookie) return AppStatus.NeedLogin;
    if (isLoading) return AppStatus.NowLoading;
    if (!firstLogin) return AppStatus.NeedInitialSetup;
    if (error?.response?.status === 401) {
      logout();
      return AppStatus.NeedLogin;
    }
    if (error) return AppStatus.Error;
    return AppStatus.Authenticated;
  }, [firstLogin, isLoading, error, logout, authCookie]);
  return { status, logout };
}
