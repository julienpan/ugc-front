import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CinemaPage } from './cinema.page';

const routes: Routes = [
  {
    path: '',
    component: CinemaPage
  },
  {
    path: 'cinema-detail',
    loadChildren: () => import('./cinema-detail/cinema-detail.module').then( m => m.CinemaDetailPageModule)
  },
  {
    path: 'cinema-detail/:id',
    loadChildren: () => import('./cinema-detail/cinema-detail.module').then( m => m.CinemaDetailPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CinemaPageRoutingModule {}
