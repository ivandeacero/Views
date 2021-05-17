import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import SelectBox from 'devextreme-react/select-box';
import { Form, TextField, SelectField } from './FormElements';
import { config } from '../../utils/config';
import { callApi } from '../../utils/utils';

class Tickets extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: undefined,
      tiposTicket: [],
    };

    this.onSelectTipoTicket = this.onSelectTipoTicket.bind(this);
  }

  setFormData(datosAdicionales) {
    const _formData = {};

    for (const key of Object.keys(datosAdicionales)) {
      _formData[key] = '';
    }

    return _formData;
  }

  getFormElement(elementName, elementSchema) {
    const props = {
      name: elementName,
      label: elementSchema.nomDatoAdicional,
      options: elementSchema.options,
    };

    if (elementSchema.nomTipoDato === 'text' || elementSchema.nomTipoDato === 'email') {
      return <TextField {...props} />;
    }

    if (elementSchema.nomTipoDato === 'select') {
      return <SelectField {...props} />;
    }
  }

  onSubmit(values, { setSubmitting, resetForm, setStatus }) {
    console.log(values);
  }

  getTiposTicket() {
    const urlTickets = `${config.UrlApiProject}ticket/getTipoTicket`;
    callApi(urlTickets, 'GET', null, (res) => {
      this.setState({ tiposTicket: res.data });
    });
  }

  onSelectTipoTicket(data) {
    this.getDatosAdicionales(data.value);
  }

  getDatosAdicionales(data) {
    const { claTipoTicket } = data;
    const urlTickets = `${
      config.UrlApiProject
    }ticket/getDatosAdicionales/${claTipoTicket.toString()}`;

    callApi(urlTickets, 'GET', null, (res) => {
      this.setState({
        claTipoTicket,
        datosAdicionales: res.data,
        formData: this.setFormData(res.data),
      });
    });
  }

  componentDidMount() {
    this.getTiposTicket();
  }

  render() {
    const Formulario = () => {
      if (this.state.formData) {
        return (
          <div>
            <Form enableReinitialize initialValues={this.state.formData} onSubmit={this.onSubmit}>
              {Object.keys(this.state.datosAdicionales).map((key, ind) => (
                <div key={key}>{this.getFormElement(key, this.state.datosAdicionales[key])}</div>
              ))}

              <Button
                id="btnGuardar"
                className="animation-on-hover"
                color="success"
                size="sm"
                type="submit"
              >
                Guardar
              </Button>
            </Form>
          </div>
        );
      }
      return <div />;
    };

    return (
      <div className="content">
        <Row className="align-items-start">
          <Col md={{ size: 4, offset: 4 }}>
            <h4>Captura de Tickets</h4>
            <SelectBox
              dataSource={this.state.tiposTicket}
              searchEnabled
              noDataText="No hay Tipos de Ticket"
              placeholder="Seleccionar un Tipo de Ticket"
              displayExpr="nomTipoTicket"
              displayValue="claTipoTicket"
              value={this.state.productoSelec}
              onValueChanged={this.onSelectTipoTicket}
            />
            <br />
          </Col>
        </Row>
        <Row className="align-items-start">
          <Col md={{ size: 4, offset: 4 }}>
            <div id="formularioPedidos">
              <Formulario />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default Tickets;
