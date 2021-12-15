import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CinemaDetailPageRoutingModule } from './cinema-detail-routing.module';

import { CinemaDetailPage } from './cinema-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CinemaDetailPageRoutingModule
  ],
  declarations: [CinemaDetailPage]
})
export class CinemaDetailPageModule {}
