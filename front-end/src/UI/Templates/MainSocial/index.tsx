import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function MainSocial() {
  return (
    <Container>
      <Col>
        <Row style={{ background: 'orange', fontSize: 50 }}>
          This is going to be the user page
        </Row>
        <Row style={{ fontSize: 100 }}>this will be the tab</Row>
      </Col>
    </Container>
  );
}

export default MainSocial;
