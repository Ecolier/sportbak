import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ManagerGameSheetComponent} from './manager-game-sheet.component';

const routes: Routes = [
  {path: '', component: ManagerGameSheetComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesheetRoutingModule {}
