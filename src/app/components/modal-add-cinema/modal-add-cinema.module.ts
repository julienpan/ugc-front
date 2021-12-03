import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAddCinemaPageRoutingModule } from './modal-add-cinema-routing.module';

import { ModalAddCinemaPage } from './modal-add-cinema.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAddCinemaPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDRR_3xXZVJZAI3ev3ndcxgavcSNFo5mSA',
      libraries: ['places']
    }),

  ],
  declarations: [ModalAddCinemaPage]
})
export class ModalAddCinemaPageModule {}
