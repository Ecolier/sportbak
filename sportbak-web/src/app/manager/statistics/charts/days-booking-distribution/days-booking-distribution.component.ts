import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {complexColor} from 'src/app/manager/shared/const/statistics-colors';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../../../../shared/components/base.component';
import {WEEKDAYS} from '../../../shared/helpers/date.helper';

@Component({
  selector: 'days-booking-distribution',
  templateUrl: './days-booking-distribution.component.html',
  styleUrls: ['./days-booking-distribution.component.scss'],
})
export class DaysBookingDistributionComponent extends FBKComponent implements OnChanges {
  @Input() statData: any;
  @Input() customColors: string[];
  @Input() fields;
  @Input() bookingsType: string;
  @Input() types: string[];

  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = [];
  chartColors: Color[];
  chartTitle: string;
  chartOptions: any;
  mode = 'complex';

  fieldsChartData = [];
  complexChartData: ChartDataSets[] = [];

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Charts');
  }

  fbkOnInit() {
    this.chartTitle = this.setTitle();
    this.initialise();
  }

  fbkInputChanged(inputName: string, currentValue: any, lastValue: any) {
    if (['statData', 'fields'].includes(inputName)) {
      this.initialise();
    }
  }


  initialise() {
    this.initChartColors();
    this.resetValues();
    this.setChartLabels();
    this.trimData();
    this.setChartOptions();
    this.setChartLabels();
  }

  private trimData() {
    const details = this.statData.details;
    const fieldsId = this.fields.map((field) => field._id);
    for (const fieldId of fieldsId) {
      this.fieldsChartData.push({data: [0, 0, 0, 0, 0, 0, 0], label: this.getFieldName(fieldId)});
    }
    for (const day of details) {
      let dayNumber = new Date(day.from).getDay() - 1;
      if (dayNumber < 0) {
        dayNumber = 6;
      }
      for (const fieldId of fieldsId) {
        const field = day.data[fieldId];
        let bookingsTotal = 0;
        for (const type of this.types) {
          bookingsTotal += field.count[type];
        }
        this.fieldsChartData
            .find((charDatum) => charDatum.label === this.getFieldName(fieldId))
            .data[dayNumber] += bookingsTotal;
      }
    }
    this.complexChartData = [{data: [0, 0, 0, 0, 0, 0, 0], label: this.getTranslation('complex')}];
    for (let dayNumber = 0; dayNumber < 7; dayNumber++) {
      for (const fieldsChartDatum of this.fieldsChartData) {
        this.complexChartData[0].data[dayNumber] += fieldsChartDatum.data[dayNumber];
      }
    }
    this.checkMode();
  }

  checkMode() {
    if (this.mode === 'fields') {
      this.chartData = this.fieldsChartData;
      this.chartTitle = this.setTitle();
    } else {
      this.chartData = this.complexChartData;
      this.chartTitle = this.setTitle();
    }
    this.setChartOptions();
  }

  private setChartLabels() {
    this.chartLabels = [];
    for (const day of WEEKDAYS) {
      this.chartLabels.push(this.getTranslation(day));
    }
  }

  getFieldName(id: string) {
    return this.fields.find((field) => field._id === id).name;
  }

  setChartOptions() {
    const middleLabel = this.getTranslation('bookings');
    const fontColor = '#ecf0f1';
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      title: {display: true, fontColor, position: 'top', text: this.chartTitle, fontSize: 20, fullWidth: false},
      legend: {display: false},
      scales: {
        yAxes: [{
          scaleLabel: {display: true, labelString: this.getTranslation('nb-bookings'), fontColor},
          ticks: {beginAtZero: true, precision: 0, fontColor},
        }],
        xAxes: [{
          ticks: {fontColor},
        }],
      },
      tooltips: {
        enabled: true,
        callbacks: {
          title(tooltipItem, data) {
            let title = '';
            for (const item of tooltipItem) {
              title += data.datasets[item.datasetIndex].label + ' ';
            }
            return title;
          },
          label(tooltipItem, data) {
            const count = data
                .datasets[tooltipItem.datasetIndex]
                .data[tooltipItem.index];
            return middleLabel + ' : ' + count;
          },
        },
      },
    };
  }

  resetValues() {
    this.fieldsChartData = [];
    this.complexChartData = [];
    this.chartData = [];
    this.chartLabels = [];
  }

  changeView() {
    if (this.mode === 'fields') {
      this.mode = 'complex';
    } else {
      this.mode = 'fields';
    }
    this.checkMode();
    this.initChartColors();
  }

  initChartColors() {
    this.chartColors = [];
    if (this.mode === 'complex') {
      this.chartColors.push({backgroundColor: complexColor.replace('1)', '0.5)'), borderColor: complexColor});
    } else {
      const bgColors = this.customColors.map((color) => color.replace('1)', '0.5)'));
      for (let i = 0; i < bgColors.length; i++) {
        this.chartColors.push({borderColor: this.customColors[i], backgroundColor: bgColors[i]});
      }
    }
  }

  setTitle() {
    return this.getTranslation('bookings-' + this.bookingsType);
  }
}
