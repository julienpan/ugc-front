import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAddMoviePage } from './modal-add-movie.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAddMoviePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAddMoviePageRoutingModule {}
