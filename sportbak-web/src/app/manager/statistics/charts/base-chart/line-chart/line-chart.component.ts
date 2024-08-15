import {Component, ElementRef, Input} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {FBKComponent} from '../../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../../shared/services/translate/translate.service';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent extends FBKComponent {
  @Input() lineChartData: ChartDataSets[]; // = [ { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' }, ];
  @Input() lineChartLabels: Label[]; // = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  @Input() lineChartColors: Color[]; // = [ { borderColor: 'black', backgroundColor: 'rgba(255,0,0,0.3)', }, ];
  @Input() lineChartOptions: ChartOptions;
  @Input() lineChartTitle: string;

  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'LineChartComponent');
  }

  fbkOnInit(): void {
  }
}
