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
import { AgmCoreModule, MapsAPILoader } from "@agm/core";

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

  cinemaListAround = [];

  isAdmin : boolean = false;

  isAround : boolean = false;
  latitude = 0;
  longitude = 0;

  constructor(
    private firestore: AngularFirestore,
    private modalCtrl: ModalController,
    private adminService: AdminService,
    private mapsAPILoader: MapsAPILoader,
    ) {}

  ngOnInit() {

    this.getAllCinema();

    if(localStorage.getItem('admin') != null) {
      this.isAdmin = true;
      console.log('Mode admin');
    } else {
      this.isAdmin = false;
      console.log('Mode User');
    }

    this.isAround = history.state.around != null ? history.state.around : false;
    this.latitude = history.state.lat != null ? history.state.lat : 0;
    this.longitude = history.state.lng != null ? history.state.lng : 0;

    console.log(this.isAround, this.latitude, this.longitude);
    if(this.isAround == true) {
      this.segmentForm = 'AROUND';
    }
  }

  calculateDistance(cinemaList) {
    cinemaList.forEach(r => {
      if(r.address.latitude != 0 && r.address.longitude != 0) {
        // console.log('LOCATION POSSIBLE :', r);

        this.mapsAPILoader.load().then(() => {
          const location1 = new google.maps.LatLng(r.address.latitude, r.address.longitude);
          const location2 = new google.maps.LatLng(this.latitude, this.longitude);
  
          let distance = google.maps.geometry.spherical.computeDistanceBetween(location1, location2);
          distance = distance / 1000;
          // console.log('NAME : ', r.name, 'DISTANCE : ', distance.toFixed(1));
          if(parseFloat(distance.toFixed(1)) <= 30.0) {
            // console.log(r);
            this.cinemaListAround.push(r);
          }
        })
      }
    })
  }

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
    }).then(() => {
      console.log('CINEMA LIST', this.cinemaList);
      if(this.isAround == true) {
        this.calculateDistance(this.cinemaList);
      }
    })
    this.cinemaList.pop();

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
