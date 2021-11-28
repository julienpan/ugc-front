import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CinemaPageRoutingModule } from './cinema-routing.module';

import { CinemaPage } from './cinema.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CinemaPageRoutingModule
  ],
  declarations: [CinemaPage]
})
export class CinemaPageModule {}
