import React from 'react';
import { Route, Router, Redirect } from 'react-router-dom';
import classnames from 'classnames';
import env from '@beam-australia/react-env';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from 'reactstrap';
import AuthHeader from 'components/Headers/AuthHeader';
import { config } from '../../utils/config';
import AdminLayout from '../../layouts/Admin';

import {
  setSessionData,
  sessionAlive,
  logOut,
  showSweetAlert,
  callApi,
  getSessionItem,
} from '../../utils/utils';

const REACT_APP_VAR = env('VAR');
const REACT_APP_OTRO = env('OTRO');
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      usuario: '',
      password: '',
    };

    this.onChangeUsuario = this.onChangeUsuario.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const urlWebService = `${config.UrlLoginServer}Login/authenticate`;

    const data = {
      username: this.state.usuario,
      password: this.state.password,
    };

    if (data.username === '' || data.password === '') {
      showSweetAlert('Precaución', 'Ingresar el usuario y contraseña', 'warning');
      return;
    }

    callApi(urlWebService, 'POST', data, (res) => {
      if (!res.token) {
        showSweetAlert('Error', res.mensaje, 'error');
      } else {
        setSessionData({
          NomUsuario: res.nombreUsuario,
          Token: res.token,
          NumUsuario: data.username,
        });

        this.setState({
          numUsuario: data.username,
        });
      }
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  onChangeUsuario(e) {
    this.setState({
      usuario: e.target.value,
    });
  }

  componentDidMount() {
    document.body.classList.add('bg-default');
  }

  componentWillUnmount() {
    document.body.classList.remove('bg-default');
  }

  render() {
    console.log('REACT_APP_VAR', REACT_APP_VAR);
    console.log('REACT_APP_OTRO', REACT_APP_OTRO);
    if (sessionAlive()) {
      const url = getSessionItem('url', '/layout/Pedidos');
      document.body.classList.remove('bg-default');
      // Primer componente al que se va a redirigir después de iniciar sesión
      return (
        <Router history={this.props.history}>
          <Route path="/" render={(props) => <AdminLayout {...props} />} />
          <Redirect from="/" to={url} />
        </Router>
      );
    }
    logOut();
    document.body.classList.add('bg-default');

    return (
      <>
        <AuthHeader />
        <Container className="mt--7 pb-5">
          <Row className="justify-content-center">
            <Col lg="6" md="7">
              <Card className="card-login bg-secondary border-0 mb-0">
                <CardBody className="card-login px-lg-5 py-lg-5">
                  <Form role="form">
                    <FormGroup
                      className={classnames('mb-3', {
                        focused: this.state.focusedEmail,
                      })}
                    >
                      <div className="mb-2">
                        <span className="kar-label">Usuario</span>
                      </div>
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText className="kar-input-login">
                            <i className="far fa-user kar-icon-color" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          className="kar-input-login"
                          onChange={this.onChangeUsuario}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup
                      className={classnames({
                        focused: this.state.focusedPassword,
                      })}
                    >
                      <div className="mb-2">
                        <span className="kar-label mb-1">Contraseña</span>
                      </div>
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText className="kar-input-login">
                            <i className="fas fa-unlock-alt kar-icon-color" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          className="kar-input-login"
                          onChange={this.onChangePassword}
                        />
                      </InputGroup>
                    </FormGroup>
                    <div className="text-center">
                      <Button
                        onClick={this.handleSubmit}
                        color="warning"
                        type="button"
                        style={{ width: '30%' }}
                      >
                        Ingresar
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
              <Row className="mt-3">
                <Col xs="6">
                  <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
                    <small>¿Olvidaste tu contraseña?</small>
                  </a>
                </Col>
                <Col className="text-right" xs="6">
                  <a className="text-light" href="#pablo" onClick={(e) => e.preventDefault()}>
                    <small>No recuerdo mi usuario</small>
                  </a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Login;
