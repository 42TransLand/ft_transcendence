import React from 'react';

const LogoutContext = React.createContext<() => void>(() => {});

export function useLogout() {
  return React.useContext(LogoutContext);
}

export function LogoutProvider({
  children,
  callback,
}: {
  children: React.ReactNode;
  callback: () => void;
}) {
  return (
    <LogoutContext.Provider value={callback}>{children}</LogoutContext.Provider>
  );
}
