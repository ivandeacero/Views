import React from 'react';
import Form, { Item } from 'devextreme-react/form';
import SelectBox from 'devextreme-react/select-box';
import 'devextreme-react/text-area';
import { Row, Col, Button } from 'reactstrap';
import { config } from '../../utils/config';
import { callApi, showSweetAlert } from '../../utils/utils';
import { initDatosAdicionales } from './initDatosAdicionales';

class TicketsSimple extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tiposTicket: [],
      tipoTicketSelect: {},
      da: this.initDatosAdicionales(),
      btnGuardarDisabled: true,
    };

    this.onSubmitTickets = this.onSubmitTickets.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onSelectTipoTicket = this.onSelectTipoTicket.bind(this);
    this.onSelectValue = this.onSelectValue.bind(this);
    this.refFrmTickets = React.createRef();
  }

  initDatosAdicionales() {
    return JSON.parse(JSON.stringify(initDatosAdicionales));
  }

  onSelectTipoTicket(data) {
    this.setState({
      tipoTicketSelect: data.value,
    });
    this.getDatosAdicionales(data.value);
  }

  onChangeInput(key, data) {
    this.setState({
      da: {
        ...this.state.da,
        [key]: {
          ...this.state.da[key],
          value: data.value,
        },
      },
    });
  }

  onSelectValue(key, data) {
    if (this.state.da[key].tagDependiente) {
      const dependienteKey = this.state.da[key].tagDependiente;
      const url = `${config.UrlApiProject}${this.state.da[dependienteKey].url}${
        data.value[this.state.da[key].displayValue]
      }`;
      callApi(url, 'GET', null, (res) => {
        this.setState({
          da: {
            ...this.state.da,
            [dependienteKey]: {
              ...this.state.da[dependienteKey],
              data: res.data,
            },
          },
        });
      });
    }
    this.onChangeInput(key, data);
  }

  async getDatosAdicionales(data) {
    const { claTipoTicket } = data;
    const urlTickets = `${
      config.UrlApiProject
    }ticket/getDatosAdicionales/${claTipoTicket.toString()}`;

    callApi(urlTickets, 'GET', null, (res) => {
      const datosAdicionales = this.initDatosAdicionales();

      Object.keys(res.data).map((key) => {
        datosAdicionales[key] = res.data[key];
        datosAdicionales[key].visible = true;
        return true;
      });

      this.setState({
        da: datosAdicionales,
        btnGuardarDisabled: false,
      });

      this.getSelectBoxData();
      this.limpiarValores();
    });
  }

  async getSelectBoxData() {
    const datosAdicionales = this.state.da;

    await Promise.all(
      Object.keys(datosAdicionales).map(async (key) => {
        if (
          datosAdicionales[key].visible &&
          datosAdicionales[key].url &&
          !datosAdicionales[key].esDependiente
        ) {
          const urlProductos = config.UrlApiProject + datosAdicionales[key].url;
          await callApi(urlProductos, 'GET', null, (res) => {
            datosAdicionales[key].data = res.data;
          });
        }
        return true;
      })
    );

    this.setState({
      da: datosAdicionales,
    });
  }

  getTiposTicket() {
    const urlTickets = `${config.UrlApiProject}ticket/getTipoTicket`;
    callApi(urlTickets, 'GET', null, (res) => {
      this.setState({ tiposTicket: res.data });
    });
  }

  get frmTickets() {
    return this.refFrmTickets.current ? this.refFrmTickets.current.instance : null;
  }

  onSubmitTickets() {
    if (this.frmTickets.validate().isValid) {
      const ticketDet = [];

      Object.keys(this.state.da).map((key) => {
        if (this.state.da[key].visible) {
          ticketDet.push({
            claDatoAdicional: this.state.da[key].claDatoAdicional,
            valDatoAdicional: this.state.da[key].url
              ? this.state.da[key].value[this.state.da[key].displayValue]
              : this.state.da[key].value,
          });
        }
        return true;
      });

      const urlAgregarTicket = `${config.UrlApiProject}ticket/addTicketSimple`;

      const body = {
        claTipoTicket: this.state.tipoTicketSelect.claTipoTicket,
        nomTicket: 'Informacion de prueba',
        claTicket: 0,
        ticketDet,
      };

      callApi(urlAgregarTicket, 'POST', body, (res) => {
        // Limpio el Formulario
        this.limpiarValores();
        // Se Insertó la informacion correctamente
        showSweetAlert('Operación Correcta', 'Se insertó la información correctamente', 'success');
      });
    }
  }

  limpiarValores() {
    this.setState({
      da: {
        ...this.state.da,
        campoUno: {
          ...this.state.da.campoUno,
          value: '',
        },
        campoDos: {
          ...this.state.da.campoDos,
          value: '',
        },
        campoTres: {
          ...this.state.da.campoTres,
          value: '',
        },
        campoCuatro: {
          ...this.state.da.campoCuatro,
          value: '',
        },
        campoCinco: {
          ...this.state.da.campoCinco,
          value: '',
        },
        campoSeis: {
          ...this.state.da.campoSeis,
          value: '',
        },
        campoSiete: {
          ...this.state.da.campoSiete,
          value: '',
        },
        campoOcho: {
          ...this.state.da.campoOcho,
          value: '',
        },
        campoNueve: {
          ...this.state.da.campoNueve,
          value: '',
        },
        campoDiez: {
          ...this.state.da.campoDiez,
          value: '',
        },
        campoOnce: {
          ...this.state.da.campoOnce,
          value: '',
        },
        campoDoce: {
          ...this.state.da.campoDoce,
          value: '',
        },
        campoTrece: {
          ...this.state.da.campoTrece,
          value: '',
        },
        campoCatorce: {
          ...this.state.da.campoCatorce,
          value: '',
        },
        campoQuince: {
          ...this.state.da.campoQuince,
          value: '',
        },
      },
    });
  }

  componentDidMount() {
    this.getTiposTicket();
  }

  render() {
    const Formulario = () => {
      const dataForm = {
        campoUno: this.state.da.campoUno.value,
        campoDos: this.state.da.campoDos.value,
        campoTres: this.state.da.campoTres.value,
        campoCuatro: this.state.da.campoCuatro.value,
        campoCinco: this.state.da.campoCinco.value,
        campoSeis: this.state.da.campoSeis.value,
        campoSiete: this.state.da.campoSiete.value,
        campoOcho: this.state.da.campoOcho.value,
        campoNueve: this.state.da.campoNueve.value,
        campoDiez: this.state.da.campoDiez.value,
        campoOnce: this.state.da.campoOnce.value,
        campoDoce: this.state.da.campoDoce.value,
        campoTrece: this.state.da.campoTrece.value,
        campoCatorce: this.state.da.campoCatorce.value,
        campoQuince: this.state.da.campoQuince.value,
      };

      // Reglas de validacion
      const validationRules = {
        requerido: [{ type: 'required', message: 'El campo es requerido' }],
      };

      return (
        <div>
          <Form
            ref={this.refFrmTickets}
            key="formTickets"
            id="form"
            formData={dataForm}
            colCount={2}
            showColonAfterLabel
            showValidationSummary={false}
          >
            <Item
              dataField="campoUno"
              editorType={this.state.da.campoUno.nomTipoDato}
              label={{ text: this.state.da.campoUno.nomDatoAdicional }}
              validationRules={this.state.da.campoUno.requerido ? validationRules.requerido : false}
              visible={this.state.da.campoUno.visible}
              value={this.state.da.campoUno.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoUno', data),
              }}
            />
            <Item
              dataField="campoDos"
              editorType={this.state.da.campoDos.nomTipoDato}
              label={{ text: this.state.da.campoDos.nomDatoAdicional }}
              validationRules={this.state.da.campoDos.requerido ? validationRules.requerido : false}
              visible={this.state.da.campoDos.visible}
              value={this.state.da.campoDos.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoDos', data),
              }}
            />
            <Item
              dataField="campoTres"
              editorType={this.state.da.campoTres.nomTipoDato}
              label={{ text: this.state.da.campoTres.nomDatoAdicional }}
              validationRules={
                this.state.da.campoTres.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoTres.visible}
              value={this.state.da.campoTres.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoTres', data),
              }}
            />
            <Item
              dataField="campoCuatro"
              editorType={this.state.da.campoCuatro.nomTipoDato}
              label={{ text: this.state.da.campoCuatro.nomDatoAdicional }}
              validationRules={
                this.state.da.campoCuatro.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoCuatro.visible}
              value={this.state.da.campoCuatro.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoCuatro', data),
              }}
            />
            <Item
              dataField="campoCinco"
              editorType={this.state.da.campoCinco.nomTipoDato}
              label={{ text: this.state.da.campoCinco.nomDatoAdicional }}
              validationRules={
                this.state.da.campoCinco.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoCinco.visible}
              value={this.state.da.campoCinco.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoCinco', data),
              }}
            />
            <Item
              dataField="campoSeis"
              editorType={this.state.da.campoSeis.nomTipoDato}
              label={{ text: this.state.da.campoSeis.nomDatoAdicional }}
              validationRules={
                this.state.da.campoSeis.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoSeis.visible}
              value={this.state.da.campoSeis.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoSeis', data),
              }}
            />
            <Item
              dataField="campoSiete"
              editorType={this.state.da.campoSiete.nomTipoDato}
              label={{ text: this.state.da.campoSiete.nomDatoAdicional }}
              validationRules={
                this.state.da.campoSiete.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoSiete.visible}
              value={this.state.da.campoSiete.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoSiete', data),
              }}
            />
            <Item
              dataField="campoOcho"
              editorType={this.state.da.campoOcho.nomTipoDato}
              label={{ text: this.state.da.campoOcho.nomDatoAdicional }}
              validationRules={
                this.state.da.campoOcho.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoOcho.visible}
              value={this.state.da.campoOcho.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoOcho', data),
              }}
            />
            <Item
              dataField="campoNueve"
              editorType={this.state.da.campoNueve.nomTipoDato}
              label={{ text: this.state.da.campoNueve.nomDatoAdicional }}
              validationRules={
                this.state.da.campoNueve.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoNueve.visible}
              value={this.state.da.campoNueve.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoNueve', data),
              }}
            />
            <Item
              dataField="campoDiez"
              editorType={this.state.da.campoDiez.nomTipoDato}
              label={{ text: this.state.da.campoDiez.nomDatoAdicional }}
              validationRules={
                this.state.da.campoDiez.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoDiez.visible}
              value={this.state.da.campoDiez.value}
              editorOptions={{
                onValueChanged: (data) => this.onChangeInput('campoDiez', data),
              }}
            />
            <Item
              dataField="campoOnce"
              label={{ text: this.state.da.campoOnce.nomDatoAdicional }}
              validationRules={
                this.state.da.campoOnce.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoOnce.visible}
              value={this.state.da.campoOnce.value}
            >
              <SelectBox
                dataSource={this.state.da.campoOnce.data}
                searchEnabled
                noDataText="No hay información"
                placeholder="Seleccionar"
                displayExpr={this.state.da.campoOnce.displayExpr}
                displayValue={this.state.da.campoOnce.displayValue}
                value={this.state.da.campoOnce.value}
                onValueChanged={(data) => this.onSelectValue('campoOnce', data)}
              />
            </Item>
            <Item
              dataField="campoDoce"
              label={{ text: this.state.da.campoDoce.nomDatoAdicional }}
              validationRules={
                this.state.da.campoDoce.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoDoce.visible}
              value={this.state.da.campoDoce.value}
            >
              <SelectBox
                dataSource={this.state.da.campoDoce.data}
                searchEnabled
                noDataText="No hay información"
                placeholder="Seleccionar"
                displayExpr={this.state.da.campoDoce.displayExpr}
                displayValue={this.state.da.campoDoce.displayValue}
                value={this.state.da.campoDoce.value}
                onValueChanged={(data) => this.onSelectValue('campoDoce', data)}
              />
            </Item>
            <Item
              dataField="campoTrece"
              label={{ text: this.state.da.campoTrece.nomDatoAdicional }}
              validationRules={
                this.state.da.campoTrece.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoTrece.visible}
              value={this.state.da.campoTrece.value}
            >
              <SelectBox
                dataSource={this.state.da.campoTrece.data}
                searchEnabled
                noDataText="No hay información"
                placeholder="Seleccionar"
                displayExpr={this.state.da.campoTrece.displayExpr}
                displayValue={this.state.da.campoTrece.displayValue}
                value={this.state.da.campoTrece.value}
                onValueChanged={(data) => this.onSelectValue('campoTrece', data)}
              />
            </Item>
            <Item
              dataField="campoCatorce"
              label={{ text: this.state.da.campoCatorce.nomDatoAdicional }}
              validationRules={
                this.state.da.campoCatorce.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoCatorce.visible}
              value={this.state.da.campoCatorce.value}
            >
              <SelectBox
                dataSource={this.state.da.campoCatorce.data}
                searchEnabled
                noDataText="No hay información"
                placeholder="Seleccionar"
                displayExpr={this.state.da.campoCatorce.displayExpr}
                displayValue={this.state.da.campoCatorce.displayValue}
                value={this.state.da.campoCatorce.value}
                onValueChanged={(data) => this.onSelectValue('campoCatorce', data)}
              />
            </Item>
            <Item
              dataField="campoQuince"
              label={{ text: this.state.da.campoQuince.nomDatoAdicional }}
              validationRules={
                this.state.da.campoQuince.requerido ? validationRules.requerido : false
              }
              visible={this.state.da.campoQuince.visible}
              value={this.state.da.campoQuince.value}
            >
              <SelectBox
                dataSource={this.state.da.campoQuince.data}
                searchEnabled
                noDataText="No hay información"
                placeholder="Seleccionar"
                displayExpr={this.state.da.campoQuince.displayExpr}
                displayValue={this.state.da.campoQuince.displayValue}
                value={this.state.da.campoQuince.value}
                onValueChanged={(data) => this.onSelectValue('campoQuince', data)}
              />
            </Item>
          </Form>
          <Button
            onClick={this.onSubmitTickets}
            className="animation-on-hover float-right"
            color="success"
            disabled={this.state.btnGuardarDisabled}
          >
            Guardar
          </Button>
        </div>
      );
    };
    return (
      <div className="content">
        <Row className="align-items-start">
          <Col md={{ size: 4, offset: 4 }}>
            <h2>Captura de Tickets</h2>
            <br />
            <SelectBox
              dataSource={this.state.tiposTicket}
              searchEnabled
              noDataText="No hay Tipos de Ticket"
              placeholder="Seleccionar un Tipo de Ticket"
              displayExpr="nomTipoTicket"
              displayValue="claTipoTicket"
              value={this.state.tipoTicketSelect}
              onValueChanged={this.onSelectTipoTicket}
            />
            <br />
          </Col>
        </Row>
        <Row className="align-items-start">
          <Col md={{ size: 10, offset: 1 }}>
            <div id="formularioTickets">
              <Formulario />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
export default TicketsSimple;
