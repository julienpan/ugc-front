import { Component, OnInit } from '@angular/core';
import {
  AngularFireList,
  AngularFireDatabase,
} from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import {
  AngularFirestoreModule,
  AngularFirestoreCollection,
  AngularFirestoreCollectionGroup,
  AngularFirestoreDocument,
  AngularFirestore,
} from '@angular/fire/compat/firestore/';
import { collection, doc, GeoPoint, setDoc, Firestore } from 'firebase/firestore';
import { ModalController } from '@ionic/angular';
import { ModalAddCinemaPage } from 'src/app/components/modal-add-cinema/modal-add-cinema.page';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.page.html',
  styleUrls: ['./cinema.page.scss'],
})
export class CinemaPage implements OnInit {
  segmentForm:
    | 'tous'
    | 'paris'
    | 'bordeaux'
    | 'hautsDeFrance'
    | 'lyon'
    | 'nantes'
    | 'toulouse' = 'tous';

  form: {
    value:
      | 'tous'
      | 'paris'
      | 'bordeaux'
      | 'hautsDeFrance'
      | 'lyon'
      | 'nantes'
      | 'toulouse';
    disable: boolean;
  }[] = [
    { value: 'tous', disable: false },
    { value: 'paris', disable: false },
    { value: 'bordeaux', disable: false },
    { value: 'hautsDeFrance', disable: false },
    { value: 'lyon', disable: false },
    { value: 'nantes', disable: false },
    { value: 'toulouse', disable: false },
  ];

  cinemaRef: AngularFirestoreCollection<any>;
  cinema: Observable<any[]>;

  cinemaList = [
    {
      name: '',
      address: {
        fullAddress: '',
        street: '',
        street_2: '',
        city: '',
        country: '',
        zipCode: '',
        latitude: 0,
        longitude: 0,
      },
    },
  ];


  constructor(
    private firestore: AngularFirestore,
    private modalCtrl: ModalController) {}

  ngOnInit() {
    this.cinemaList = [];
    this.getAllCinema();
  }


  getAllCinema() {
    this.cinemaList = [];
    this.cinema = this.firestore.collection('cinema').valueChanges({idField: 'customId'});
    this.cinema.forEach((r) => {
      r.forEach((r2) => {
        console.log('ID : ', r2.customId);
        this.cinemaList.push({
          name: r2.name,
          address: r2.address,
        });
      });
    });
    // this.cinemaList.pop();
    console.log('CINEMA LIST', this.cinemaList);
  }

  async openModalAddCinema() {
    const modal = await this.modalCtrl.create({
      component: ModalAddCinemaPage,
    });
    return await modal.present();
  }

  segmentChanged($event) {
    this.segmentForm = $event.detail.value;
  }
}
