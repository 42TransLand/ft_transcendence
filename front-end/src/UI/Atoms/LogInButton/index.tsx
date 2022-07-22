import React from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';

const BlackBox = styled.div`
  background-color: black;
  width: 300px;
  height: 80px;
`;

function LogInButton() {
  return (
    <BlackBox>
      <Button variant="light" size="lg">
        LOGIN
      </Button>{' '}
    </BlackBox>
  );
}

export default LogInButton;
