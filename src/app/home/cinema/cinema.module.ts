import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CinemaPageRoutingModule } from './cinema-routing.module';

import { CinemaPage } from './cinema.page';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CinemaPageRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDRR_3xXZVJZAI3ev3ndcxgavcSNFo5mSA',
      libraries: ['places', 'geometry']
    }),
  ],
  declarations: [CinemaPage]
})
export class CinemaPageModule {}
