import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalCinemaPage } from './modal-cinema.page';

const routes: Routes = [
  {
    path: '',
    component: ModalCinemaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalCinemaPageRoutingModule {}
