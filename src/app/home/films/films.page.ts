import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalCinemaPage } from 'src/app/components/modal-cinema/modal-cinema.page';

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
})
export class FilmsPage implements OnInit {


  slideOpts = {
    slidesPerView: 3.1,
  }

  constructor(
    private modalCtrl: ModalController,
  ) { }

  ngOnInit() {
  }

  async openModalCinema() {
    const modal = await this.modalCtrl.create({
      component: ModalCinemaPage,
    });
    return await modal.present();
  }

}
