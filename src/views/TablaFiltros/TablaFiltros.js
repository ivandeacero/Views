import React from 'react';
import DataGrid, {
  Column,
  Editing,
  Popup,
  Lookup,
  Paging,
  Texts,
} from 'devextreme-react/data-grid';
import { Row, Col } from 'reactstrap';
import { config } from '../../utils/config';
import { callApi, showSweetAlert } from '../../utils/utils';
// import FiltroClasificacion from './FiltroClasificacion';
import Header from '../../components/Headers/Header';

class TablaFiltros extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      unidades: [],
      selectedUnidad: null,
    };

    // Se asocia el metodo o evento al componente
    this.onRowInserted = this.onRowInserted.bind(this);
    this.onRowUpdated = this.onRowUpdated.bind(this);
    this.onSelectFiltroOrigen = this.onSelectFiltroOrigen.bind(this);
  }

  onSelectFiltroOrigen(selection) {
    this.setState({ origen: selection, resetOrigen: false });
  }

  /**
   * Metodo para obtener los productos
   */
  getProductos = () => {
    // Obtener Productos
    const urlProductos = `${config.UrlApiProject}producto/getProductos`;
    callApi(urlProductos, 'GET', null, (res) => {
      this.setState({ productos: res.data });
    });
  };

  /**
   * Metodo para obtener los unidades
   */
  getUnidades = () => {
    // Obtener Unidades
    const urlUnidades = `${config.UrlApiProject}catalogo/getUnidades`;
    callApi(urlUnidades, 'GET', null, (res) => {
      this.setState({ unidades: res.data });
    });
  };

  /**
   * Metodo para Insertar nuevos registros
   * @param {Object} obj contiene el objeto contenido {data} en el Row con los valores modificados
   */
  onRowInserted(obj) {
    if (obj.data) {
      // Parametros o cuerpo del servicio
      const body = {
        nomProducto: obj.data.nomProducto,
        descripcion: obj.data.descripcion,
        precio: obj.data.precio,
        claUnidad: obj.data.claUnidad,
      };

      // Insertar Producto
      const urlInsertarProd = `${config.UrlApiProject}producto/addProducto`;
      callApi(urlInsertarProd, 'POST', body, (res) => {
        // Se insertop la informacion correctamente
        showSweetAlert('Operación Correcta', 'Se insertó la información correctamente', 'success');
        this.getProductos();
      });
    }
  }

  /**
   * Metodo para Actualizar nuevos registros
   * @param {Object} obj contiene el objeto contenido {data} en el Row con los valores modificados
   */
  onRowUpdated(obj) {
    if (obj.data) {
      // Parametros o cuerpo del servicio
      const body = {
        nomProducto: obj.data.nomProducto,
        descripcion: obj.data.descripcion,
        precio: obj.data.precio,
        claUnidad: obj.data.claUnidad,
        bajaLogica: obj.data.bajaLogica ? 1 : 0, // Los controles de DevExtreme regresan dato bool (true:false)
      };

      // console.log(obj);
      // console.log(body);

      // Actualizar Producto
      const urlActualizaProd = `${config.UrlApiProject}producto/updateProducto/${obj.data.claProducto}`;
      callApi(urlActualizaProd, 'PUT', body, (res) => {
        // Actualizo la informacion correctamente
        showSweetAlert(
          'Operación Correcta',
          'Se actualizó la información correctamente',
          'success'
        );
        this.getProductos();
      });
    }
  }

  componentDidMount() {
    // Obtener Unidades
    this.getUnidades();

    // Obtener Productos
    this.getProductos();
  }

  render() {
    const GridContent = (
      <DataGrid
        id="gridContenedor"
        dataSource={this.state.productos}
        keyExpr="claProducto"
        showBorders={false}
        columnHidingEnabled
        columnAutoWidth={false}
        showColumnHeaders
        showColumnLines={false}
        showRowLines
        noDataText="Sin Registros"
        wordWrapEnabled
        rowAlternationEnabled={false}
        onRowInserted={this.onRowInserted}
        onRowUpdated={this.onRowUpdated}
      >
        <Paging enabled pageSize={15} />

        <Editing mode="popup" allowUpdating allowDeleting={false} allowAdding>
          <Popup title="Producto" showTitle width={700} height={600} />
          <Texts saveRowChanges="Guardar" cancelRowChanges="Cancelar" />
        </Editing>

        <Column
          dataField="claProducto"
          caption="Clave Producto"
          minWidth={100}
          alignment="center"
          allowEditing={false}
        />
        <Column dataField="nomProducto" caption="Producto" minWidth={150} />
        <Column dataField="precio" caption="Precio" width={150} alignment="center" />
        <Column dataField="claUnidad" caption="Unidad" minWidth={150}>
          <Lookup dataSource={this.state.unidades} valueExpr="claUnidad" displayExpr="nomUnidad" />
        </Column>
        <Column dataField="descripcion" caption="Descripcion" minWidth={300} />
        <Column dataField="cantidad" caption="Cantidad" width={150} alignment="center" />
        <Column
          dataField="bajaLogica"
          caption="BajaLogica"
          width={100}
          alignment="center"
          dataType="boolean"
          visible={false}
        />
      </DataGrid>
    );

    const Filtros = () => <div>{GridContent}</div>;

    return (
      <>
        <Header />
        <div className="content mt--9">
          <Row className="align-items-start">
            <Col md={12}>
              <h2 className="text-white">Productos</h2>
            </Col>
            {/* <Col md={6}>
              <FiltroClasificacion
                onSelectCallBack={this.onSelectFiltroOrigen}
              />
            </Col> */}
          </Row>
          <Row>
            <Col md={12}>
              <Filtros />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}
export default TablaFiltros;
