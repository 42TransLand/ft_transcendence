import React from 'react';
import styled from 'styled-components';
import Logo from '../../Atoms/Logo';

type LoginBodyProps = {
  children: React.ReactNode;
};

const InteractiveSectionBox = styled.div`
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, 0);
`;

export default function LoginBody({
  children,
}: React.PropsWithChildren<LoginBodyProps>) {
  return (
    <>
      <Logo />
      <InteractiveSectionBox>{children}</InteractiveSectionBox>
    </>
  );
}
