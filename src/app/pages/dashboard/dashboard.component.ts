import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsuarioEdicionService } from '../../services/feature.service.index';

import { DashboardService } from 'src/app/services/feature/Administracion/Dashboard/dashboard-service';
import { GlobalService } from '../../services/global.service';

import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

import { Chart } from 'chart.js';
import { AliadoComercial } from 'src/app/models/aliadoComercial.model';
import { MonthlyFinancingSummary } from 'src/app/models/dashboard/MonthlyFinancingSummary';
import { CarouselComponent } from 'src/app/components/carousel/carousel.component';
class Item {
  label: string;
  value: any;
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  @ViewChild(CarouselComponent, { static: true })
  carousel: CarouselComponent;

  availableCommercialAllyList: AliadoComercial[];

  selectedCommercialAlly: AliadoComercial;
  selectedChannel: string;
  selectedDate: Item;

  monthlyFinancingSummary = new MonthlyFinancingSummary();

  availableDateList: Item[] = [];
  availableChannelList: Item[];

  chartData: MonthlyFinancingSummary[];
  displayedColumns = ['name', 'productCount', 'financingCount', 'financingAmount'];
  chartLabelArray = [];
  chartDataArray = [];

  totalProductCount: number;
  totalFinancingCount: number;
  totalFinancingAmount: number;

  myChart: Chart;
  constructor(
    public activatedRoute: ActivatedRoute,
    public usuarioEdicionServicio: UsuarioEdicionService,
    public dashboardService: DashboardService,
    public global: GlobalService
  ) {}

  ngOnInit() {
    this.selectedCommercialAlly = this.carousel.selectedCommercialAlly;
    this.createChart();
    this.getAvailableAllies();
    this.getMonthlyFinancingSummary(new Date(), null);
    this.getMonthlyChartData();
    this.getAvailableDateList();

    this.availableChannelList = this.getAvailableChannelList();
    this.selectedChannel = '';

    localStorage.setItem('fechaEntrega1','0');
    localStorage.setItem('fechaVenta1','0');
  }
  getAvailableAllies() {
    this.dashboardService.getAvailableCommercialAllyList().subscribe(response => {
      this.availableCommercialAllyList = response.data;
      this.carousel.loadCards(this.availableCommercialAllyList);
      if (this.availableCommercialAllyList.length == 1)
        this.selectedCommercialAlly = this.availableCommercialAllyList[0];
    });
  }
  getMonthlyFinancingSummary(date?: Date, commercialAllyId?: number) {
    if (this.availableCommercialAllyList !== undefined)
      this.selectedCommercialAlly = this.availableCommercialAllyList.find(p => p.id == commercialAllyId);
    this.dashboardService.getMonthlyFinancingSummary(date, commercialAllyId).subscribe(response => {
      this.monthlyFinancingSummary = response.data;
    });
  }
  getMonthlyChartData(commercialAllyId?: number, channelId?: string, date?: Date) {
    this.dashboardService.getMonthlyChartData(commercialAllyId,(channelId=='' ? null : channelId==null ? null : parseInt(channelId,10)), date).subscribe(response => {
      this.chartLabelArray = response.data.map(element => {
        return element.name;
      });
      this.chartDataArray = response.data.map(element => {
        return element.financingCount;
      });
      this.chartData = response.data;
      this.totalProductCount = response.data.map(t => t.productCount).reduce((acc, value) => acc + value, 0);
      this.totalFinancingCount = response.data.map(t => t.financingCount).reduce((acc, value) => acc + value, 0);
      this.totalFinancingAmount = response.data.map(t => t.financingAmount).reduce((acc, value) => acc + value, 0);

      this.myChart.data.labels = this.chartLabelArray;
      this.myChart.data.datasets[0].data = this.chartDataArray;
      this.myChart.update();
    });
  }

  private getRandomColorArray(length: number): any[] {
    let array = [];
    // for (let i = 0; i < length; i++) {
    //   array.push(this.getRandomColor());
    // }
    array = ['#083884', '#a8122c', '#5b5da7', '#fdb827'];
    return array;
  }

  private getRandomColor() {
    return 'hsl(' + 360 * Math.random() + ',' + (25 + 70 * Math.random()) + '%,' + (60 + 10 * Math.random()) + '%)';
  }

  createChart() {
    let canvas = <HTMLCanvasElement>document.getElementById('chartdiv');
    let ctx = canvas.getContext('2d');

    let colorArray = this.getRandomColorArray(4);
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: '# de financiamientos',
            data: [],
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
                stepSize: 1,
                autoSkip: false
              }
            }
          ]
        }
      }
    });
  }

  getAvailableDateList() {
    let monthNameList = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];
    let maxMonthCount = 6;
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    for (let i = 0; i < maxMonthCount; i++) {
      this.availableDateList.unshift({
        label: monthNameList[currentMonth - i],
        value: new Date(currentYear, currentMonth - i, 1)
      });
    }
    this.selectedDate = this.availableDateList[this.availableDateList.length - 1];
  }
  getAvailableChannelList(): Item[] {
    return [
      { label: 'Todos', value: '' },
      { label: 'Retail', value: '1' },
      { label: 'CallCenter', value: '2' },
      { label: 'CSC', value: '3' }
    ];
  }

  commercialAllySelected(commercialAlly: AliadoComercial) {
    this.selectedCommercialAlly = commercialAlly;
    this.selectedChannel = '';
    this.selectedDate = this.availableDateList[this.availableDateList.length - 1];
    this.getMonthlyFinancingSummary(new Date(), commercialAlly.id);
    this.getMonthlyChartData(commercialAlly.id, null, this.selectedDate.value);
  }
  dateSelected(date: Item) {
    this.selectedChannel = '';
    this.selectedDate = date;
    this.getMonthlyChartData(this.selectedCommercialAlly.id, null, date.value);
  }

  downloadPDF() {
    let node = document.getElementById('divContentBarra');

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
}
