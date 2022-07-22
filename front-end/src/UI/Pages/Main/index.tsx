import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MainStandby from '../../Templates/MainStandby';
import MainSocial from '../../Templates/MainSocial';

function Main() {
  return (
    <Container fluid>
      <Row>
        <Col xs={9} id="main-standby-wrapper">
          <MainStandby />
        </Col>
        <Col xs={3} id="main-social-wrapper">
          <MainSocial />
        </Col>
      </Row>
    </Container>
  );
}

export default Main;
