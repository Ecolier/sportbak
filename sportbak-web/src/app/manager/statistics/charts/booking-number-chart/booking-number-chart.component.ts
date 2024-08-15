import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {ChartDataSets} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {complexColor} from 'src/app/manager/shared/const/statistics-colors';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';
import {FBKComponent} from '../../../../shared/components/base.component';
import {oneNumberToTwoNumber} from '../../../shared/helpers/date.helper';

@Component({
  selector: 'booking-number-chart',
  templateUrl: './booking-number-chart.component.html',
  styleUrls: ['./booking-number-chart.component.scss'],
})
export class BookingNumberChartComponent extends FBKComponent implements OnChanges {
  @Input() statData: any;
  @Input() customColors: string[];
  @Input() fields;
  @Input() sizeInterval: number;
  @Input() possibleIntervals;

  @Output() intervalEmitter: EventEmitter<number> = new EventEmitter<number>();

  mode: 'complex' | 'fields' = 'complex';

  chartData: ChartDataSets[] = [];
  chartLabels: Label[] = [];
  chartColors: Color[];
  chartTitle: string;
  chartOptions: any;
  fieldsChartData = [];
  complexChartData: ChartDataSets[] = [];
  hasBookings = true;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Charts');
  }

  fbkOnInit(): void {
    this.initialise();
  }

  fbkInputChanged(inputName: string, currentValue: any, lastValue: any) {
    if (['statData', 'fields'].includes(inputName)) {
      this.initialise();
    }
  }

  private initialise() {
    this.initChartColors();
    this.resetValues();
    this.trimData();
    this.setChartOptions();
  }

  setChartOptions() {
    const middleLabel = this.getTranslation('bookings');
    const fontColor = '#ecf0f1';
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      title: {display: true, fontColor, position: 'top', text: this.chartTitle, fontSize: 20},
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
              title += data.datasets[item.datasetIndex].label;
            }
            return title;
          },
          afterTitle(item, data) {
            return data.labels[item[0].index].toString();
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

  trimData() {
    const details = this.statData.details;
    const dayNumber = this.statData.details.length;
    const fieldsId = this.fields.map((ff) => ff._id);
    this.chartLabels = [];
    for (const fieldId of fieldsId) {
      this.fieldsChartData.push({data: [], label: this.getFieldName(fieldId)});
    }
    for (const day of details) {
      const date = new Date(day.from);
      this.chartLabels.push(oneNumberToTwoNumber(date.getDate()) + '/' + oneNumberToTwoNumber(date.getMonth() + 1));
      for (const fieldId of fieldsId) {
        const field = day.data[fieldId];
        this.fieldsChartData.find((charDatum) => charDatum.label === this.getFieldName(fieldId)).data
            .push(field.count.acceptedByManager + field.count.acceptedByBooker);
      }
    }
    this.complexChartData = [{data: [], label: this.getTranslation('complex')}];
    for (let i = 0; i < dayNumber; i++) {
      let total = 0;
      for (const fieldCharDatum of this.fieldsChartData) {
        total += fieldCharDatum.data[i];
      }
      this.complexChartData[0].data.push(total);
    }
    this.checkMode();
    this.checkIfHasData();
  }

  changeView() {
    if (this.mode === 'fields') {
      this.mode = 'complex';
    } else {
      this.mode = 'fields';
    }
    this.checkMode();
  }

  checkMode() {
    if (this.mode === 'fields') {
      this.chartData = this.fieldsChartData;
      this.chartTitle = this.getTranslation('nb-bookings') + this.getTranslation('by-field');
    } else {
      this.chartData = this.complexChartData;
      this.chartTitle = this.getTranslation('nb-bookings') + this.getTranslation('in-complex');
    }
    this.setChartOptions();
    this.initChartColors();
  }

  resetValues() {
    this.fieldsChartData = [];
    this.complexChartData = [];
    this.chartData = [];
    this.chartLabels = [];
  }

  getFieldName(id: string) {
    return this.fields.find((field) => field._id === id).name;
  }

  initChartColors() {
    this.chartColors = [];
    if (this.mode === 'complex') {
      this.chartColors.push({backgroundColor: complexColor});
    } else {
      for (const customColor of this.customColors) {
        this.chartColors.push({backgroundColor: customColor});
      }
    }
  }

  checkIfHasData() {
    for (const chartDatum of this.chartData) {
      for (const item of chartDatum.data) {
        if (item !== 0) {
          this.hasBookings = true;
          return;
        }
      }
      this.hasBookings = false;
    }
  }

  emitInterval() {
    this.intervalEmitter.emit(this.sizeInterval);
  }
}
