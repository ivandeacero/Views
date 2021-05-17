import React from 'react';
import Form, { Item } from 'devextreme-react/form';
import SelectBox from 'devextreme-react/select-box';
import FileUploader from 'devextreme-react/file-uploader';
import { Autocomplete } from 'devextreme-react/autocomplete';
import Header from '../../components/Headers/Header';
import 'devextreme-react/text-area';
import { Row, Col, Card, CardText, CardHeader, CardBody, CardTitle, Button } from 'reactstrap';
import GraficaPie from '../Grafica/Grafica';
import { config } from '../../utils/config';
import { callApi, callKrakenApi, showSweetAlert, getCliente } from '../../utils/utils';

class FormularioCaptura extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      producto: 0,
      unidad: '',
      claUnidad: 0,
      cantidad: 0,
      precio: 0,
      clausuario: 0,
      nomusuario: '',
      total: 0,
      comentarios: '',
      fechaEntrega: '',
      status: '',
      productos: [],
      pedidos: [],
      statusPedidos: [],
      productoSelec: {},
      statusSelec: {},
      responseKraken: [],
      archivos: [],
    };

    // Se asocia el metodo o evento al componente
    this.onSelecProducto = this.onSelecProducto.bind(this);
    this.onSubmitPedidos = this.onSubmitPedidos.bind(this);
    this.onChangeCantidad = this.onChangeCantidad.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeComentarios = this.onChangeComentarios.bind(this);
    this.onChangeFechaEntrega = this.onChangeFechaEntrega.bind(this);
    this.onSelectionChangedUsuario = this.onSelectionChangedUsuario.bind(this);
    this.onValueChangedUsuario = this.onValueChangedUsuario.bind(this);
    this.onValueChangedArchivos = this.onValueChangedArchivos.bind(this);
    // Para manipular el formulario directamente es posible crear una referencia
    this.refFrmPedidos = React.createRef();
  }

  get frmPedidos() {
    return this.refFrmPedidos.current ? this.refFrmPedidos.current.instance : null;
  }

  onSubmitPedidos() {
    if (this.frmPedidos.validate().isValid) {
      const data = this.frmPedidos.option('formData');
      console.log(`PEDIDO: ${JSON.stringify(data)}`);

      // Agregar Pedido
      const urlAgregarPedido = `${config.UrlApiProject}pedido/addPedido`;

      const formData = new FormData();
      formData.append('claProducto', data.Producto);
      formData.append('claUsuario', getCliente());
      formData.append('claUnidad', data.ClaUnidad);
      formData.append('cantidad', data.Cantidad);
      formData.append('comentarios', data.Comentarios);
      formData.append('fechaEntrega', data.FechaEntrega.toISOString());
      formData.append('claEstatus', data.Status);
      formData.append('precioTotal', data.Total);

      console.log(data.Archivos.length);
      for (let i = 0; i < data.Archivos.length; i++) {
        formData.append('archivos', data.Archivos[i]);
      }

      callApi(
        urlAgregarPedido,
        'POST',
        formData,
        (res) => {
          // Se Insertó la informacion correctamente
          showSweetAlert(
            'Operación Correcta',
            'Se insertó la información correctamente',
            'success'
          );
          this.getPedidos();
        },
        true
      );

      // Limpio el Formulario
      this.setState({
        producto: 0,
        unidad: '',
        claUnidad: 0,
        cantidad: 0,
        precio: 0,
        clausuario: 0,
        nomusuario: '',
        total: 0,
        comentarios: '',
        fechaEntrega: '',
        status: '',
        productoSelec: {},
        statusSelec: {},
        archivos: [],
      });
    }
  }

  onSelecProducto(data) {
    // Actualizo la informacion del precio
    this.setState({
      productoSelec: data.value,
      producto: data.value.claProducto,
      unidad: data.value.nomUnidad,
      claUnidad: data.value.claUnidad,
      precio: data.value.precio,
    });
  }

  onChangeStatus(data) {
    // Actualizo la informacion del estatus
    this.setState({
      statusSelec: data.value,
      status: data.value.claEstatus,
    });
  }

  onChangeCantidad(data) {
    // Se guarda en el estado la nueva cantidad
    this.setState({ cantidad: data.value });

    // Se calcula con el nuevo valor
    const total = this.state.cantidad * this.state.precio;

    // Se actualiza el valor del total en el estado
    this.setState({ total });
  }

  onChangeComentarios(data) {
    // Actualizo la informacion de los comentarios
    this.setState({
      comentarios: data.value,
    });
  }

  onChangeFechaEntrega(data) {
    // Actualizo la informacion de la fecha de Entrega
    this.setState({
      fechaEntrega: data.value,
    });
  }

  onSelectionChangedUsuario(data) {
    // Actualizo la informacion del usuario seleccionado

    this.setState({
      clausuario: data.selectedItem.ClaUsuario,
      nomusuario: data.selectedItem.NomUsuario,
    });
  }

  onValueChangedUsuario(data) {
    // Actualizo la informacion del usuario seleccionado
    this.setState({
      clausuario: 0,
      nomusuario: '',
    });
  }

  onValueChangedArchivos(data) {
    console.log(data.value);
    this.setState({ archivos: data.value });
  }

  getPedidos = () => {
    const urlPedidos = `${config.UrlApiProject}pedido/getPedidosUsuario/${getCliente()}`;
    callApi(urlPedidos, 'GET', null, (res) => {
      // Guardo en el estado la informacion de los estados
      this.setState({ pedidos: res.data });
    });
  };

  getProductos = () => {
    const urlProductos = `${config.UrlApiProject}producto/getProductos`;
    callApi(urlProductos, 'GET', null, (res) => {
      // Guardo en el estado la informacion de los productos
      this.setState({ productos: res.data });
    });
  };

  getEstados = () => {
    const urlEstatus = `${config.UrlApiProject}catalogo/getEstatus`;
    callApi(urlEstatus, 'GET', null, (res) => {
      // Guardo en el estado la informacion de los estados
      this.setState({ statusPedidos: res.data });
    });
  };

  componentDidMount() {
    // Ejecutar consulta a base de datos
    // Obtener Pedidos
    this.getPedidos();

    // Obtener Productos
    this.getProductos();

    // Obtener Estados
    this.getEstados();
  }

  render() {
    const Formulario = () => {
      const dataForm = {
        Producto: this.state.producto,
        Unidad: this.state.unidad,
        ClaUnidad: this.state.claUnidad,
        Precio: this.state.precio,
        Cantidad: this.state.cantidad,
        Comentarios: this.state.comentarios,
        FechaEntrega: this.state.fechaEntrega,
        Status: this.state.status,
        Total: this.state.total,
        Archivos: this.state.archivos,
      };

      // Reglas de validacion
      const validationRules = {
        requerido: [{ type: 'required', message: 'El campo es requerido' }],
      };

      return (
        <div>
          <Form
            ref={this.refFrmPedidos}
            key="formPedidos"
            id="form"
            formData={dataForm}
            colCount={1}
            showColonAfterLabel
            showValidationSummary={false}
            elementAttr={{ enctype: 'multipart/form-data' }}
          >
            <Item dataField="Usuario">
              <UsuariosDemanda validationRules={validationRules.requerido} />
            </Item>
            <Item dataField="Producto" validationRules={validationRules.requerido}>
              <SelectBox
                dataSource={this.state.productos}
                searchEnabled
                noDataText="No hay productos"
                placeholder="Seleccionar"
                displayExpr="descripcion"
                displayValue="claProducto"
                value={this.state.productoSelec}
                onValueChanged={this.onSelecProducto}
              />
            </Item>
            <Item dataField="Unidad" value={this.state.unidad} disabled />
            <Item dataField="Precio" value={this.state.precio} disabled />
            <Item
              dataField="Cantidad"
              editorType="dxNumberBox"
              validationRules={validationRules.requerido}
              value={this.state.cantidad}
              editorOptions={{
                onValueChanged: this.onChangeCantidad,
              }}
            />
            <Item
              dataField="Comentarios"
              editorType="dxTextArea"
              editorOptions={{
                height: 150,
                onValueChanged: this.onChangeComentarios,
              }}
              validationRules={validationRules.requerido}
              value={this.state.comentarios}
            />
            <Item
              dataField="FechaEntrega"
              caption="Fecha de entrega"
              editorType="dxDateBox"
              editorOptions={{ onValueChanged: this.onChangeFechaEntrega }}
              validationRules={validationRules.requerido}
              value={this.state.fechaEntrega}
            />
            <Item dataField="Status" validationRules={validationRules.requerido}>
              <SelectBox
                dataSource={this.state.statusPedidos}
                searchEnabled
                noDataText="No hay estados"
                placeholder="Seleccionar"
                displayExpr="nomEstatus"
                displayValue="claEstatus"
                value={this.state.statusSelec}
                onValueChanged={this.onChangeStatus}
              />
            </Item>
            <Item dataField="Archivos">
              <FileUploader
                multiple
                selectButtonText="Adjuntar archivos"
                labelText="o suelta los archivos aquí"
                showFileList
                uploadMode="useForm"
                value={this.state.archivos}
                onValueChanged={this.onValueChangedArchivos}
              />
            </Item>
            <Item dataField="Total" value={this.state.total} editorOptions={{ readOnly: true }} />
          </Form>
          <Button
            onClick={this.onSubmitPedidos}
            className="animation-on-hover float-right"
            color="warning"
          >
            Guardar
          </Button>
        </div>
      );
    };

    const PedidosCapturados = (props) => {
      const pedidos = props.pedidos.map((pedido) => (
        <Card key={pedido.claPedido} style={{ height: 230, width: 250, margin: '10px' }}>
          <CardHeader>
            <CardTitle>
              Clave de Pedido:
              {pedido.claPedido}
            </CardTitle>
          </CardHeader>
          <CardBody className="p-2">
            <CardText className="mb-0">
              <span className="kar-label pr-3">Total</span>
              <span className="kar-label-black">{pedido.precioTotal}</span>
            </CardText>
            <CardText className="mb-0">
              <span className="kar-label pr-3">Unidad</span>
              <span className="kar-label-black">{pedido.nomUnidad}</span>
            </CardText>
            <CardText className="mb-0">
              <span className="kar-label pr-3">Comentarios</span>
              <span className="kar-label-black">{pedido.comentarios}</span>
            </CardText>
            <CardText className="mb-0">
              <span className="kar-label pr-3">Fecha</span>
              <span className="kar-label-black">{pedido.fechaEntrega}</span>
            </CardText>
            <CardText className="mb-0">
              <span className="kar-label pr-3">Status</span>
              <span className="kar-label-black">{pedido.nomEstatus}</span>
            </CardText>
          </CardBody>
        </Card>
      ));

      return <Row style={{ flexWrap: 'inherit' }}>{pedidos}</Row>;
    };

    const itemUserTemplate = (itemData) => <div> {itemData.NomUsuario}</div>;
    const usuarioBusqueda = {
      key: 'ClaUsuario',
      keyType: 'Int32',
      perf1: '',
      load: async (loadOptions) => {
        let data = [];

        const paramsService = {
          Columnas: 'ClaUsuario, NomUsuario, Email',
          Condicion: `NomUsuario LIKE '%${loadOptions.searchValue}%' ORDER BY NomUsuario `,
        };

        await callKrakenApi(7, 8, paramsService, 5, (res) => {
          data = res;
        });

        return data;
      },
    };

    const UsuariosDemanda = (validationRules) => {
      const { nomusuario } = this.state;

      if (nomusuario !== '') {
        return (
          <div>
            {' '}
            <Autocomplete
              name="Usuario"
              dataSource={usuarioBusqueda}
              placeholder="Escribe Id o Nombre de Usuario.."
              valueExpr="NomUsuario"
              displayExpr="NomUsuario"
              showClearButton
              minSearchLength={3}
              searchTimeout={500}
              itemRender={itemUserTemplate}
              onSelectionChanged={this.onSelectionChangedUsuario}
              onValueChanged={this.onValueChangedUsuario}
              value={this.state.nomusuario}
            />
          </div>
        );
      }

      return (
        <div>
          {' '}
          <Autocomplete
            name="Usuario"
            dataSource={usuarioBusqueda}
            placeholder="Escribe Id o Nombre de Usuario.."
            valueExpr="NomUsuario"
            displayExpr="NomUsuario"
            showClearButton
            minSearchLength={3}
            searchTimeout={500}
            itemRender={itemUserTemplate}
            onSelectionChanged={this.onSelectionChangedUsuario}
            validationRules={validationRules.requerido}
          />
        </div>
      );
    };

    return (
      <>
        <Header />
        <div className="content mt--9">
          <Row className="align-items-start">
            <Col md="4">
              <h2 className="text-white">Captura de Pedidos</h2>
              <div id="formularioPedidos" className="kar-component" style={{ height: '1000px' }}>
                <Formulario />
              </div>
            </Col>
            <Col md="8">
              <Row>
                <Col md="12">
                  <h2 className="text-white">Pedidos Capturados</h2>
                  <div
                    id="pedidosCapturados"
                    className="kar-component"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      height: 300,
                      overflowY: 'hidden',
                      overflowX: 'auto',
                    }}
                  >
                    <PedidosCapturados pedidos={this.state.pedidos} />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <h2>Dashboard Pedidos</h2>
                  <div
                    id="dashboardPedidos"
                    style={{
                      height: 250,
                      padding: '10px 0px',
                    }}
                  >
                    <GraficaPie />
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
export default FormularioCaptura;
