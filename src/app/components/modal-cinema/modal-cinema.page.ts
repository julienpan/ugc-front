import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-cinema',
  templateUrl: './modal-cinema.page.html',
  styleUrls: ['./modal-cinema.page.scss'],
})
export class ModalCinemaPage implements OnInit {

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
  ) { }

  ngOnInit() {
    this.getAllCinema();
  }

  getAllCinema() {
    this.cinemaList = [];
    this.cinema = this.firestore.collection('cinema').valueChanges({idField: 'customId'});
    this.cinema.forEach((r) => {
      r.forEach((r2) => {
        // console.log('ID : ', r2.customId);
        this.cinemaList.push({
          name: r2.name,
          address: r2.address,
        });
      });
    });
    // this.cinemaList.pop();
    console.log('CINEMA LIST', this.cinemaList);
  }

}
