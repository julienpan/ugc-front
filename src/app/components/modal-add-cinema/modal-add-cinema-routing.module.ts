import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddCinemaPage } from './modal-add-cinema.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddCinemaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddCinemaPageRoutingModule {}
