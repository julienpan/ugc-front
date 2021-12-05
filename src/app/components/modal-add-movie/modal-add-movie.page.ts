import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-modal-add-movie',
  templateUrl: './modal-add-movie.page.html',
  styleUrls: ['./modal-add-movie.page.scss'],
})
export class ModalAddMoviePage implements OnInit {

  movieForm = {
    name: '',
    releaseDate: '',
    note: 0,
    duration: '',
    producerName: '',
    synopsis: '',
    image: '',
    trailer: '',
    cinemaList: [],
  }

  movie: Observable<any[]>;

  cinemaRef: AngularFirestoreCollection<any>;
  cinema: Observable<any[]>;

  genreRef: AngularFirestoreCollection<any>;
  genre: Observable<any[]>;

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

  genreList = [];

  cinemaSelected = [];
  genreSelected = [];

  constructor(
    private modalCtrl: ModalController,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
    this.cinemaList = [];
    this.getAllCinema();
    this.getAllGenre();
  
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

  getAllGenre() {
    this.genre = this.firestore.collection('genres').valueChanges();
    this.genre.forEach(r => {
      r.forEach(r2 => {
        r2.genresList.forEach(r3 => {
          if(!this.genreList.includes(r3)) {
            this.genreList.push(r3);
          }
        })
      })
    })
    console.log('GENRELIST : ', this.genreList);
  }



  addMovie() {
    const movieRef = this.firestore.collection('movie');
    movieRef.doc(this.movieForm.name).set({
      name: this.movieForm.name,
      releaseDate: this.movieForm.releaseDate,
      note: 0,
      duration: this.movieForm.duration,
      producerName: this.movieForm.producerName,
      synopsis: this.movieForm.synopsis,
      trailer: this.movieForm.trailer,
      cinemaList: this.cinemaSelected,
      genres: this.genreSelected
    })
    this.dismissModal();
  }

  dismissModal(object?) {
    this.modalCtrl.dismiss(object);
  }

}
