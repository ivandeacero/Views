import React from 'react';
// reactstrap components
import { Container, Row, Col } from 'reactstrap';

// core components
import Header from 'components/Headers/Header.js';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Header />
        <Container className="mt--9" fluid>
          <Row>
            <Col className="mb-12 mb-xl-0" xl="8">
              <h1>Hola</h1>
            </Col>
          </Row>
          <Row>
            <Col className="mb-12 mb-xl-0" xl="8">
              <h1>Hola</h1>
            </Col>
          </Row>
          <Row>
            <Col className="mb-12 mb-xl-0" xl="8">
              <h1>Hola</h1>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Dashboard;
