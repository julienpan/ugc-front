import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddMoviePageRoutingModule } from './modal-add-movie-routing.module';

import { ModalAddMoviePage } from './modal-add-movie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddMoviePageRoutingModule
  ],
  declarations: [ModalAddMoviePage]
})
export class ModalAddMoviePageModule {}
