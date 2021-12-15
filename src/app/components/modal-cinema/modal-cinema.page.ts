import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CinemaList } from 'src/app/interfaces/cinema-list';

@Component({
  selector: 'app-modal-cinema',
  templateUrl: './modal-cinema.page.html',
  styleUrls: ['./modal-cinema.page.scss'],
})
export class ModalCinemaPage implements OnInit {

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

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
    private modalCtrl: ModalController,
    private firestorage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.getAllCinema();
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
        // if(r2.address.fullAddress.includes('Paris')) {
        //   this.cinemaListParis.push(r2);
        // } else if(r2.address.fullAddress.includes('Bordeaux')) {
        //   this.cinemaListBordeaux.push(r2);
        // } else if(r2.address.fullAddress.includes('Lyon')) {
        //   this.cinemaListLyon.push(r2);
        // } else if(r2.address.fullAddress.includes('Nantes')) {
        //   this.cinemaListNantes.push(r2);
        // } else if(r2.address.fullAddress.includes('Toulouse')) {
        //   this.cinemaListToulouse.push(r2);
        // }
      });
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

  goToCinema(cinema) {
    console.log(cinema);
    this.router.navigateByUrl(`/home/accueil/cinema/cinema-detail/${cinema.name = cinema.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()}`, {
      state: {
        cinema: cinema
      }
    })
    this.dismissModal();
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
