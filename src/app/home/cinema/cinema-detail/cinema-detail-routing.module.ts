import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CinemaDetailPage } from './cinema-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CinemaDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CinemaDetailPageRoutingModule {}
