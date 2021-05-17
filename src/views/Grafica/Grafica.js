import React, { Component } from 'react';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { callApi, getCliente } from '../../utils/utils';
import { config } from '../../utils/config';

class Grafica extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartOptions: {
        chart: {
          type: 'pie',
          width: 200,
          height: 300,
          backgroundColor: '#fff',
          style: {
            float: 'left',
          },
        },
        credits: {
          enabled: false,
        },
        colors: [
          '#002c6f',
          '#ff6a00',
          '#eeeeee',
          '#DDDF00',
          '#24CBE5',
          '#64E572',
          '#FF9655',
          '#FFF263',
          '#6AF9C4',
        ],
        title: {
          text: '',
        },
        legend: {
          itemStyle: {
            fontSize: '10pt',
            font: '10pt Trebuchet MS, Verdana, sans-serif',
            color: '#A0A0A0',
          },
        },
        tooltip: {
          headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          pointFormat:
            '<tr><td style="color:{series.color};padding:0">Pedidos: </td>' +
            '<td style="padding:0;"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true,
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
            borderWidth: 0,
          },
        },
      },
      series: [],
    };
  }

  componentDidMount() {
    // Obtener Grafica de estado de Pedidos
    const urlPedidosGrafica = `${
      config.UrlApiProject
    }pedido/getPedidosUsuarioGrafica/${getCliente()}`;
    callApi(urlPedidosGrafica, 'GET', null, (res) => {
      // Hago un preproceso para adaptar los valores a la grafica
      const series = [];
      res.data.forEach((serie) => {
        const serieA = { name: serie.nomEstatus, y: serie.cantidad };
        series.push(serieA);
      });

      // Guardo en el estado la informacion de los estados
      this.setState({ chartOptions: { series: [{ data: series }] } });
    });
  }

  render() {
    return (
      <div className="kar-component">
        <HighchartsReact highcharts={Highcharts} options={this.state.chartOptions} />
      </div>
    );
  }
}

export default Grafica;
