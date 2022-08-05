import React from 'react';

export interface TargetUserContextProps {
  name: string;
}

const TargetUserContext = React.createContext<TargetUserContextProps>({
  name: '',
});

export function useTargetUser() {
  return React.useContext(TargetUserContext);
}

export function TargetUserProvider({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  const val = React.useMemo(() => ({ name }), [name]);

  return (
    <TargetUserContext.Provider value={val}>
      {children}
    </TargetUserContext.Provider>
  );
}
