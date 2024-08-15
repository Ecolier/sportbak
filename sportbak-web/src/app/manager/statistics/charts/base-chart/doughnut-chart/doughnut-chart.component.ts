import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Color, Label, MultiDataSet} from 'ng2-charts';
import {FBKComponent} from '../../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../../shared/services/translate/translate.service';

@Component({
  selector: 'doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss'],
})
export class DoughnutChartComponent extends FBKComponent implements OnChanges {
  @Input() public doughnutChartLabels: Label[];
  @Input() public doughnutChartData: MultiDataSet;
  @Input() public doughnutChartColors: Color[];
  @Input() public doughnutChartTitle: string;
  @Input() public doughnutChartOptions: ChartOptions;

  public doughnutChartType: ChartType = 'doughnut';

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'DoughnutChartComponent');
  }

  fbkOnInit(): void {
  }

  ngOnChanges() {
  }
}
