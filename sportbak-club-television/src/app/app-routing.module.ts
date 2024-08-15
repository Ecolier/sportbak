import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'multiplex',
    loadChildren: () => import('./multiplex/multiplex.module').then(m => m.MultiplexModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule)
  },
  {
    path: 'replay',
    loadChildren: () => import('./replay/replay.module').then(m => m.ReplayModule)
  },
  {
    path: 'live',
    loadChildren: () => import('./live/live.module').then(m => m.LiveModule)
  },
  {
    path: '',
    redirectTo: 'multiplex',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
