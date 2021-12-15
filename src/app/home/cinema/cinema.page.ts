import { Component, OnInit } from '@angular/core';
import {
  AngularFireList,
  AngularFireDatabase,
} from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';
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
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { CinemaList } from 'src/app/interfaces/cinema-list';

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

  movieRef: AngularFirestoreCollection<any>;
  movie: Observable<any[]>;

  cinemaList : CinemaList[] = [
    {
      name: '',
      movieList: [],
      image: '',
      distance: '',
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

  cinemaListAround : CinemaList[] = [];
  // = [
  //   {
  //     name: '',
  //     movieList: [],
  //     image: '',
  //     distance: '',
  //     address: {
  //       fullAddress: '',
  //       street: '',
  //       street_2: '',
  //       city: '',
  //       country: '',
  //       zipCode: '',
  //       latitude: 0,
  //       longitude: 0,
  //     },
  //   },
  // ];

  isAdmin : boolean = false;

  isAround : boolean = false;
  latitude = 0;
  longitude = 0;

  constructor(
    private firestore: AngularFirestore,
    private modalCtrl: ModalController,
    private adminService: AdminService,
    private mapsAPILoader: MapsAPILoader,
    private firestorage: AngularFireStorage,
    private router: Router
    ) {}

  ngOnInit() {


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

    this.getAllCinema();

    if(this.isAround == true) {
      this.segmentForm = 'AROUND';
      this.calculateDistance(this.cinemaList);
    }
    console.log(this.isAround, this.latitude, this.longitude);
  }

  calculateDistance(cinemaList) {
    cinemaList.forEach(r => {
      if(r.address.latitude != 0 && r.address.longitude != 0) {

        this.mapsAPILoader.load().then(() => {
          const location1 = new google.maps.LatLng(r.address.latitude, r.address.longitude);
          const location2 = new google.maps.LatLng(this.latitude, this.longitude);
          let distance = google.maps.geometry.spherical.computeDistanceBetween(location1, location2);
          distance = distance / 1000;
          // console.log('NAME : ', r.name, 'DISTANCE : ', distance.toFixed(1));
          if(parseFloat(distance.toFixed(1)) <= 100) {
            // console.log(r);
            this.cinemaListAround.push(r);
            console.log(this.cinemaListAround);
            // this.cinemaListAround.push({
            //   name: r.name,
            //   movieList: r.movieList,
            //   image: r.image,
            //   distance: distance.toFixed(1),
            //   address: {
            //     fullAddress: r.address.fullAddress,
            //     street: r.address.street,
            //     street_2: r.address.street_2,
            //     city: r.address.city,
            //     country: r.address.country,
            //     zipCode: r.address.zipCode,
            //     latitude: r.address.latitude,
            //     longitude: r.address.longitude,
            //   }
            // });
            // this.cinemaListAround.shift();
          }
        })
      }
    })
  }

  getAllCinema() {
    this.cinema = this.firestore.collection('cinema').valueChanges({idField: 'customId'}).pipe(take(1))
    this.cinema.forEach((r) => {
      r.forEach((r2) => {
        r2.name = r2.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        this.firestorage.ref(`cinemaImages/${r2.name.toLowerCase()}.jpeg`).getDownloadURL().forEach(r => {
          r2.image = r;
        }).then(() => {
          this.cinemaList.push({
            name: r2.name,
            address: r2.address,
            movieList: this.getMovieByCinema(r2),
            image: r2.image,
            distance: r2.distance
          });
        })
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
      if(this.isAround == true) {
        console.log('IS AROUND : ', this.cinemaList);
        this.calculateDistance(this.cinemaList);
      }
    })
    this.cinemaList.pop();
  }

  getMovieByCinema(cinema) : any[] {
    let movieListMatched = [];
    // console.log(cinema);
    this.movie = this.firestore.collection('movie').valueChanges();
    this.movie.forEach(r => {
      r.forEach(r2 => {
        // console.log(r2);
        r2.cinemaList.forEach(r3 => {
          if(cinema.name == r3) {
            if(!movieListMatched.includes(r2.name)) {
              movieListMatched.push(r2.name);
            }
          }
        })
      })
    })
    return movieListMatched;
  } 

  getCinemaDetail(cinema) {
    // console.log(cinema);
    this.router.navigateByUrl(`/home/accueil/cinema/cinema-detail/${cinema.name.toLowerCase()}`, {
      state: {
        cinema: cinema
      }
    })
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
