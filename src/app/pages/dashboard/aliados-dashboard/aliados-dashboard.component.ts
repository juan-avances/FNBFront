import { Component, OnInit } from '@angular/core';
import { FinanciamientoEdicionService } from '../../../services/feature/Administracion/Financiamiento/financiamiento-edicion.service';
import { ActivatedRoute } from '@angular/router';
import { UsuarioEdicionService } from '../../../services/feature.service.index';

import { DashboardService } from 'src/app/services/feature/Administracion/Dashboard/dashboard-service';
import { MatTableDataSource } from '@angular/material/table';

import { GlobalService } from '../../../services/global.service';

import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

import { Chart } from 'chart.js';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-aliados-dashboard',
  templateUrl: './aliados-dashboard.component.html',
  styles: []
})
export class AliadosDashboardComponent implements OnInit {
  public visible = true;
  public rol;

  indexDates: any;

  sectionG1: string;
  sectionG2: string;

  dataFechas: any;

  /**Aliado comercial del mes */
  aliadoComercialId: number;
  canalVentaId: number;
  mesValue: Date;
  selectedChannel: string = '';

  totalCantidadFinanciamientos: any;
  totalCantidadProductos: any;
  totalMontoTotalFinanciamiento: any;

  dataSource: MatTableDataSource<DatosxCanales>;
  datosDona: any[];
  datosColumns = ['nombres', 'cantidadProductos', 'cantidadFinanciamientos', 'montoTotalFinanciamiento'];

  datosBar: any;
  //--
  cantidadFinanciamientos: string;
  cantidadProductos: string;
  montoTotalFinanciamiento: string;
  nombreComercial: string;
  porcentajeVentas: string;
  totalTiendas: string;

  /**Logo del aliado comercial del mes */
  bestCommercialAllyLogo: string;

  carrusel: any = {
    activo: false
  };

  //--
  canales: any;
  dataLogos: any;
  //--

  constructor(
    public _activatedRoute: ActivatedRoute,
    public _financiamientoEdicionServicio: FinanciamientoEdicionService,
    public _usuarioEdicionServicio: UsuarioEdicionService,

    public _dashboardServicio: DashboardService,
    public _global: GlobalService
  ) {}

  ngOnInit() {
    this.loadDataLogos();
  }

  loadDataLogos() {
    this._dashboardServicio.obtenerLogos().subscribe(response => {
      if (response.valid) {
        this.dataLogos = response.data;
        this.aliadoComercialId = response.data[0].aliadoComercialId;
        this.loadDataFirstSection();
      }
    });
  }

  loadDataFirstSection() {
    this._dashboardServicio.obtenerDatosPorAliado(this.aliadoComercialId).subscribe(response => {
      if (response.valid) {
        if (!!response.data) {
          this.dataFechas = response.data.fechas;
          this.indexDates = this.dataFechas.length - 1;
          this.canales = response.data.canalesVentas;
          this.canales.unshift({ isModificable: false, label: 'TODOS', value: '' });

          this.cantidadFinanciamientos = response.data.cantidadFinanciamientos;
          this.cantidadProductos = response.data.cantidadProductos;
          this.montoTotalFinanciamiento = response.data.montoTotalFinanciamiento;
          this.nombreComercial = response.data.nombres;
          this.porcentajeVentas = response.data.porcentajeVentas + '%';
          this.totalTiendas = response.data.totalTiendas;
          this.bestCommercialAllyLogo = response.data.base64Logo;
          this.rol = localStorage.getItem('RolUsuario');
          this.loadDataSecondSection();
          this.loadDataThirdSection();
        }
      }
    });
  }

  loadDataSecondSection(): void {
    if (this.rol == 'Administrador Web') {
      this._dashboardServicio.obtenerDatosBarraAliadosPorFecha(this.mesValue, this.canalVentaId).subscribe(response => {
        if (response.valid) {
          if (!!response.data && !!response.data.datosBarras) {
            this.datosBar = response.data.datosBarras;
            this.buildGraphBar();
          }
        }
      });
    } else if (this.rol != 'Administrador Web') {
      this._dashboardServicio
        .obtenerDatosBarraAliadosPorSedes(this.aliadoComercialId, this.mesValue, this.canalVentaId)
        .subscribe(response => {
          if (response.valid) {
            this.datosBar = response.data;
            this.buildGraphBar();
          }
        });
    }
  }

  loadDataThirdSection() {
    this._dashboardServicio
      .obtenerDatosDonaPorAliado(this.aliadoComercialId, this.mesValue, this.canalVentaId)
      .subscribe(response => {
        if (response.valid) {
          if (!!response.data) {
            this.totalCantidadFinanciamientos = response.data.totalCantidadFinanciamientos;
            this.totalCantidadProductos = response.data.totalCantidadProductos;
            this.totalMontoTotalFinanciamiento = response.data.totalMontoTotalFinanciamiento;
          }
          if (!!response.data.datos) {
            this.datosDona = response.data.datos;
            this.dataSource = new MatTableDataSource(this.datosDona);
            let s = this.datosDona.filter(x => x.cantidadProductos > 0)[0];
            if (s != undefined && s.cantidadProductos > 0) {
              this.buildGraphDoughnut2();
            } else {
              document.getElementById('piediv').innerHTML = '';
            }
          }
        }
      });
  }

  cargarAliadoMes(aliadoComercialId: any) {
    this.aliadoComercialId = aliadoComercialId;
    this.loadDataFirstSection();
  }

  filtrarDatosDona(canalVentaId: any) {
    this.canalVentaId = canalVentaId;
    this.loadDataThirdSection();
  }

  filtrarDatosBarraFechas(mesValue: any, index: any) {
    this.indexDates = index;
    this.mesValue = mesValue;
    this.loadDataSecondSection();
  }

  filtrarDatosBarraCanales(canalValue: any) {
    this.canalVentaId = canalValue;
    this.loadDataSecondSection();
  }

  // public downloadPDF(flg: any) {
  //   var data;
  //   if (flg == 1)
  //     data = document.getElementById('divContentBarra');
  //   else if (flg == 2)
  //     data = document.getElementById('divContentDona');

  //   // html2canvas(data, { scale: 2 }).then(canvas => {
  //   html2canvas(data).then(canvas => {
  //     var imgWidth = 208;
  //     var pageHeight = 295;
  //     var imgHeight = (canvas.height * imgWidth) / canvas.width;
  //     var heightLeft = imgHeight;

  //     const contentDataURL = canvas.toDataURL('image/png');
  //     let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
  //     var position = 0;
  //     pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
  //     pdf.save('MYPdf.pdf'); // Generated PDF
  //   });
  // }
  downloadPDF(flg: any) {
    let node;
    if (flg == 1) node = document.getElementById('divContentBarra');
    else if (flg == 2) node = document.getElementById('divContentDona');

    domtoimage
      .toPng(node, { bgcolor: '#fff' })
      .then(function(dataUrl) {
        let img = new Image();
        img.src = dataUrl;
        let newImage = img.src;

        img.onload = function() {
          let pdfWidth = img.width;
          let pdfHeight = img.height;
          // FileSaver.saveAs(dataUrl, 'my-pdfimage.png'); // Save as Image
          let doc;
          if (pdfWidth > pdfHeight) doc = new jsPDF('l', 'px', [pdfWidth, pdfHeight]);
          else doc = new jsPDF('p', 'px', [pdfWidth, pdfHeight]);

          let width = doc.internal.pageSize.getWidth();
          let height = doc.internal.pageSize.getHeight();

          doc.addImage(newImage, 'PNG', 10, 10, width, height);
          let filename = 'mypdf_' + '.pdf';
          doc.save(filename);
        };
      })
      .catch(function(error) {
        // Error Handling
      });
  }

  private getRandomColorArray(length: number): any[] {
    let array = [];
    for (let i = 0; i < length; i++) {
      array.push(this.getRandomColor());
    }
    return array;
  }

  private getRandomColor() {
    return 'hsl(' + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (60 + 10 * Math.random()) + '%)';
  }
  private buildGraphBar() {
    let canvas = <HTMLCanvasElement>document.getElementById('chartdiv');
    let ctx = canvas.getContext('2d');

    let labelArray = this.datosBar.map(element => {
      return element.nombres;
    });
    let dataArray = this.datosBar.map(element => {
      return element.cantidadFinanciamientos;
    });
    let colorArray = this.getRandomColorArray(dataArray.length);
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labelArray,
        datasets: [
          {
            label: '# de financiamientos',
            data: dataArray,
            backgroundColor: colorArray,
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                stepSize: 1
              }
            }
          ]
        }
      }
    });
  }

  buildGraphDoughnut2() {
    let labelArray = this.datosDona.map(element => {
      return element.nombres;
    });
    let dataArray = this.datosDona.map(element => {
      return element.cantidadProductos;
    });
    let colorArray = this.getRandomColorArray(dataArray.length);

    let canvas = <HTMLCanvasElement>document.getElementById('piediv');
    let ctx = canvas.getContext('2d');
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labelArray,
        datasets: [
          {
            label: '# de ?',
            data: dataArray,
            backgroundColor: colorArray,
            borderWidth: 1
          }
        ]
      }
    });
  }

  buildChartBar(ctx, data, options): any {
    return new Chart(ctx, {
      type: 'bar',
      data: data,
      options: options
    });
  }

  buildChartDoughnut(ctx, data, options): any {
    return new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: options
    });
  }
}

export interface DatosxCanales {
  nombres: any;
  cantidadProductos: any;
  cantidadFinanciamientos: any;
  montoTotalFinanciamiento: any;
}

// private buildGraphBar() {
//   let chart = am4core.create('chartdiv', am4charts.XYChart);
//   chart.hiddenState.properties.opacity = 0;

//   chart.data = this.datosBar;

//   chart.colors.list = [
//     am4core.color('#0164A7'),
//     am4core.color('#C50707'),
//     am4core.color('#0087BF')
//     , am4core.color('#EB7537')
//   ];

//   let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
//   categoryAxis.renderer.grid.template.location = 0;
//   categoryAxis.dataFields.category = 'nombres';
//   categoryAxis.renderer.minGridDistance = 40;
//   categoryAxis.fontSize = 11;

//   let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//   valueAxis.min = 0;

//   valueAxis.renderer.minGridDistance = 50;

//   let axisBreak = valueAxis.axisBreaks.create();

//   let hoverState = axisBreak.states.create('hover');
//   hoverState.properties.breakSize = 1;
//   hoverState.properties.opacity = 0.1;
//   hoverState.transitionDuration = 1500;

//   axisBreak.defaultState.transitionDuration = 1000;

//   let series = chart.series.push(new am4charts.ColumnSeries());
//   series.dataFields.categoryX = 'nombres';
//   series.dataFields.valueY = 'cantidadProductos';

//   series.columns.template.tooltipText = '{valueY.value}';
//   series.columns.template.tooltipY = 0;
//   series.columns.template.strokeOpacity = 0;

//   series.columns.template.adapter.add('fill', function (fill, target) {
//     return chart.colors.getIndex(target.dataItem.index);
//   });

// }

// buildGraphDoughnut2() {
//   am4core.useTheme(am4themes_animated);
//   let data = this.datosDona;

//   let container = am4core.create('piediv', am4core.Container);
//   container.width = am4core.percent(100);
//   container.height = am4core.percent(100);
//   container.layout = 'horizontal';

//   let chart1 = container.createChild(am4charts.PieChart);
//   chart1.fontSize = 11;
//   chart1.hiddenState.properties.opacity = 0;
//   chart1.data = data;
//   chart1.radius = am4core.percent(70);
//   chart1.innerRadius = am4core.percent(40);
//   chart1.zIndex = 1;

//   let series1 = chart1.series.push(new am4charts.PieSeries());
//   series1.dataFields.value = 'cantidadProductos';
//   series1.dataFields.category = 'nombres';
//   series1.colors.list = [
//     am4core.color('#F9AF03'),
//     am4core.color('#0084BE'),
//     am4core.color('#E96D27')
//     , am4core.color('#005C9D')
//   ];
//   series1.alignLabels = false;
//   series1.labels.template.bent = true;
//   series1.labels.template.radius = 3;
//   series1.labels.template.padding(0, 0, 0, 0);

//   let sliceTemplate1 = series1.slices.template;
//   sliceTemplate1.cornerRadius = 5;
//   sliceTemplate1.draggable = false;
//   sliceTemplate1.inert = true;
//   sliceTemplate1.propertyFields.fill = 'color';
//   sliceTemplate1.propertyFields.fillOpacity = 'opacity';
// }

// private buildGraphDoughnut(arr_numbers: number[], arr_names: string[]) {
//   const ctx = document.getElementById('myDoughnut');

//   const data = {
//     labels: arr_names,
//     datasets: [
//       {
//         data: arr_numbers,
//         backgroundColor: ['#E96D27', '#005C9F', '#F7B101', '#0084BF']
//       }
//     ]
//   };

//   const options = {
//     cutoutPercentage: 50,
//     responsive: true,
//     maintainAspectRatio: false,
//     animation: {
//       animateScale: false,
//       animateRotate: false
//     },
//     legend: {
//       display: false
//     },
//     tooltips: {
//       enabled: true
//     }
//   };
//   const transactionsDoughnutChart = this.buildChartDoughnut(ctx, data, options);
// }

// private getRandomColor() {
//   var letters = '0123456789ABCDEF'.split('');
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }
