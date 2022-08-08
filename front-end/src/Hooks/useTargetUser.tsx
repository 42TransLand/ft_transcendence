import React from 'react';

export interface TargetUserContextProps {
  userId: number;
  userName: string;
}

const TargetUserContext = React.createContext<TargetUserContextProps>({
  userId: 0,
  userName: '',
});

export function useTargetUser() {
  return React.useContext(TargetUserContext);
}

export function TargetUserProvider({
  children,
  userId,
  userName,
}: {
  children: React.ReactNode;
  userId: number;
  userName: string;
}) {
  const val = React.useMemo(() => ({ userId, userName }), [userId, userName]);

  return (
    <TargetUserContext.Provider value={val}>
      {children}
    </TargetUserContext.Provider>
  );
}
