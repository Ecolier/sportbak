import {NgModule} from '@angular/core';
import {ManagerSharedModule} from '../shared/manager-shared.module';
import {BarChartComponent} from './charts/base-chart/bar-chart/bar-chart.component';
import {DoughnutChartComponent} from './charts/base-chart/doughnut-chart/doughnut-chart.component';
import {LineChartComponent} from './charts/base-chart/line-chart/line-chart.component';
import {BookingNumberChartComponent} from './charts/booking-number-chart/booking-number-chart.component';
import {DaysBookingDistributionComponent} from './charts/days-booking-distribution/days-booking-distribution.component';
import {FieldsBookingDistributionComponent} from './charts/fields-booking-distribution/fields-booking-distribution.component';
import {ManagerStatisticsComponent} from './manager-statistics.component';
import {StatisticsRoutingModule} from './statistics-routing.module';

@NgModule({
  imports: [
    StatisticsRoutingModule,
    ManagerSharedModule,
  ],
  declarations: [
    BarChartComponent,
    DoughnutChartComponent,
    LineChartComponent,
    ManagerStatisticsComponent,
    BookingNumberChartComponent,
    DaysBookingDistributionComponent,
    FieldsBookingDistributionComponent,
  ],
  exports: [
    BarChartComponent,
    DoughnutChartComponent,
    LineChartComponent,
    ManagerStatisticsComponent,
    BookingNumberChartComponent,
    DaysBookingDistributionComponent,
    FieldsBookingDistributionComponent,
    ManagerSharedModule,
  ],
})
export class StatisticsModule {}
