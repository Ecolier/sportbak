import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import {Color, Label, MultiDataSet} from 'ng2-charts';
import {FBKComponent} from 'src/app/shared/components/base.component';
import {TranslateAppProvider} from 'src/app/shared/services/translate/translate.service';

@Component({
  selector: 'fields-booking-distribution',
  templateUrl: './fields-booking-distribution.component.html',
  styleUrls: ['./fields-booking-distribution.component.scss'],
})
export class FieldsBookingDistributionComponent extends FBKComponent implements OnChanges {
  @Input() statData: any;
  @Input() customColors: string[];
  @Input() fields;

  chartData: MultiDataSet = [];
  chartLabels: Label[] = [];
  chartColors: Color[];
  chartTitle: string;
  chartOptions: any;
  hasBookings = true;

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Charts');
  }

  fbkOnInit() {
    this.chartTitle = this.getTranslation('bookings-distribution');
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
    this.trimData();
    this.setChartOptions();
  }

  private trimData() {
    const details = this.statData.details;
    const fieldsId = this.fields.map((field) => field._id);
    this.chartLabels = [];
    const fieldsData = {};
    for (const fieldId of fieldsId) {
      this.chartLabels.push(this.getFieldName(fieldId));
      fieldsData[fieldId] = 0;
    }
    for (const day of details) {
      for (const fieldId of fieldsId) {
        const field = day.data[fieldId];
        fieldsData[fieldId] += field.count.acceptedByManager + field.count.acceptedByBooker;
      }
    }
    this.chartData.push([]);
    for (const fieldId of fieldsId) {
      this.chartData[0].push(fieldsData[fieldId]);
    }
    this.checkIfHasData();
  }

  private resetValues() {
    this.chartData = [];
    this.chartLabels = [];
  }

  getFieldName(id: string) {
    return this.fields.find((field) => field._id === id).name;
  }

  initChartColors() {
    this.chartColors = [{backgroundColor: this.customColors}];
  }

  checkIfHasData() {
    for (const chartDatum of this.chartData) {
      for (const chartDatumElement of chartDatum) {
        if (chartDatumElement !== 0) {
          this.hasBookings = true;
          return;
        }
      }
      this.hasBookings = false;
      this.chartData = [];
    }
  }

  setChartOptions() {
    const middleLabel = this.getTranslation('bookings');
    const fontColor = '#ecf0f1';
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      elements: {arc: {borderWidth: 0}},
      title: {display: true, text: this.chartTitle, fontColor, position: 'top', fontSize: 20, padding: 10},
      legend: {display: false},
      tooltips: {
        enabled: true,
        callbacks: {
          title(tooltipItem, data) {
            return data.labels[tooltipItem[0].index].toString();
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
}
