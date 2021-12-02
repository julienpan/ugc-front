import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddCinemaPageRoutingModule } from './modal-add-cinema-routing.module';

import { ModalAddCinemaPage } from './modal-add-cinema.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddCinemaPageRoutingModule
  ],
  declarations: [ModalAddCinemaPage]
})
export class ModalAddCinemaPageModule {}
