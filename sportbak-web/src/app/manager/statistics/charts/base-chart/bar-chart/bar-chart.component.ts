import {Component, ElementRef, Input, OnChanges} from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import {FBKComponent} from '../../../../../shared/components/base.component';
import {TranslateAppProvider} from '../../../../../shared/services/translate/translate.service';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent extends FBKComponent implements OnChanges {
  @Input() barChartLabels: Label[];
  @Input() barChartData: ChartDataSets[];
  @Input() barChartColors: Color[];
  @Input() barChartTitle: string;
  @Input() barChartOptions: ChartOptions;

  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  constructor(
    protected _refElement: ElementRef,
    protected translate: TranslateAppProvider,
  ) {
    super(_refElement, translate, 'Charts');
  }

  fbkOnInit(): void {
  }

  ngOnChanges() {
  }
}
