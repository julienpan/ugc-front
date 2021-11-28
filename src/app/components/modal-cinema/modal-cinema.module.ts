import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalCinemaPageRoutingModule } from './modal-cinema-routing.module';

import { ModalCinemaPage } from './modal-cinema.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalCinemaPageRoutingModule
  ],
  declarations: [ModalCinemaPage]
})
export class ModalCinemaPageModule {}
