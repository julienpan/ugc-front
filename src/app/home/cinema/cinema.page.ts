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
import { AdminService } from 'src/app/services/admin.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.page.html',
  styleUrls: ['./cinema.page.scss'],
})
export class CinemaPage implements OnInit {

  segmentForm: 'TOUS' | 'PARIS' | 'BORDEAUX' | 'LYON' | 'NANTES' | 'TOULOUSE' | 'AROUND' = 'TOUS';

  form: {
    value: 'TOUS' | 'PARIS' | 'BORDEAUX' | 'LYON' | 'NANTES' | 'TOULOUSE' | 'AROUND';
    disable: boolean;
  }[] = [
    { value: 'TOUS', disable: false },
    { value: 'PARIS', disable: false },
    { value: 'BORDEAUX', disable: false },
    { value: 'LYON', disable: false },
    { value: 'NANTES', disable: false },
    { value: 'TOULOUSE', disable: false },
    { value: 'AROUND', disable: false },
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

  cinemaListParis = [];
  cinemaListBordeaux = [];
  cinemaListLyon = [];
  cinemaListNantes = [];
  cinemaListToulouse = [];

  isAdmin : boolean = false;

  isAround : boolean = false;
  latitude = 0;
  longitude = 0;

  constructor(
    private firestore: AngularFirestore,
    private modalCtrl: ModalController,
    private adminService: AdminService,
    ) {}

  ngOnInit() {

    this.isAround = history.state.around != null ? history.state.around : false;
    this.latitude = history.state.lat != null ? history.state.lat : 0;
    this.longitude = history.state.lng != null ? history.state.lng : 0;

    if(this.isAround == true) {
      this.segmentForm = 'AROUND';
      console.log(this.latitude, this.longitude);
    }
    
    this.getAllCinema();
    if(localStorage.getItem('admin') != null) {
      this.isAdmin = true;
      console.log('Mode admin');
    } else {
      this.isAdmin = false;
      console.log('Mode User');
    }
  }

  // refresh() {
  //   this.getAllCinema;
  // }

  getAllCinema() {
    this.cinema = this.firestore.collection('cinema').valueChanges({idField: 'customId'}).pipe(take(1))
    this.cinema.forEach((r) => {
      r.forEach((r2) => {
        console.log('ID : ', r2.customId);
        this.cinemaList.push({
          name: r2.name,
          address: r2.address,
        });
        if(r2.address.fullAddress.includes('Paris')) {
          this.cinemaListParis.push(r2);
        } else if(r2.address.fullAddress.includes('Bordeaux')) {
          this.cinemaListBordeaux.push(r2);
        } else if(r2.address.fullAddress.includes('Lyon')) {
          this.cinemaListLyon.push(r2);
        } else if(r2.address.fullAddress.includes('Nantes')) {
          this.cinemaListNantes.push(r2);
        } else if(r2.address.fullAddress.includes('Toulouse')) {
          this.cinemaListToulouse.push(r2);
        }
      });
    });
    this.cinemaList.pop();
    console.log('CINEMA LIST', this.cinemaList);
  }

  async openModalAddCinema() {
    const modal = await this.modalCtrl.create({
      component: ModalAddCinemaPage,
    });
    // modal.onDidDismiss().then((data) => {
    //   if(data.role != 'backdrop') {
    //     this.refresh();
    //   }
    // })
    return await modal.present();
  }

  segmentChanged($event) {
    this.segmentForm = $event.detail.value;
    // this.cinema = this.firestore.collection('cinema').valueChanges({idField: 'customId'}).pipe(take(1))
    // this.cinema.forEach((r) => {
    //   r.forEach((r2) => {
    //     console.log('ID : ', r2.customId);
    //     this.cinemaList.push({
    //       name: r2.name,
    //       address: r2.address,
    //     });
    //   });
    // });
    // this.cinemaList.pop();
    // console.log('CINEMA LIST', this.cinemaList);

  }
}
