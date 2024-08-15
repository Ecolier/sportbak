import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComplexCompetitionComponent} from './complex/complex-competition/complex-competition.component';
import {ComplexCtnComponent} from './complex/complex-ctn/complex-ctn.component';
import {MainPageComponent} from './main-page/main-page.component';
import {MyComplexComponent} from './my-complex/my-complex.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'complex-ctn', component: ComplexCtnComponent},
  {path: 'my-complex', component: MyComplexComponent},
  {path: 'complex/league', component: ComplexCompetitionComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
