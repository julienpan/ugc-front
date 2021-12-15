import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

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
    type: '',
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

  typeList = ['NOUVEAU', 'AVANT-PREMIERE', 'EN-AVANT', 'NORMAL'];

  cinemaSelected = [];
  genreSelected = [];

  typeSelected : string;

  currentDate : any;

  minTime = '00:00';
  maxTime = '05:00';

  valid : boolean = false;

  title = "cloudsSorage";
  fb : any;
  selectedFile: File = null;
  downloadURL: Observable<string>;

  file : any;
  filePath : any;

  constructor(
    private modalCtrl: ModalController,
    private firestore: AngularFirestore,
    private firestorage: AngularFireStorage,
  ) { }

  onFileSelected(event) {
    this.file = event.target.files[0];
    this.filePath = `movieImages/${this.file.name.toLowerCase()}`;
  }

  ngOnInit() {

    this.currentDate = new Date(1).toISOString();

    this.cinemaList = [];
    this.getAllCinema();
    this.getAllGenre();
  
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
    // console.log('CINEMA LIST', this.cinemaList);
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
    // console.log('GENRELIST : ', this.genreList);
  }

  onSelectDuration(event) {
    console.log(event);
    this.movieForm.duration = event.detail.value.substring(11, 16);
  }

  addMovie() {

    this.checkForm();

    const fileRef = this.firestorage.ref(this.filePath);
    const task = this.firestorage.upload(`movieImages/${this.file.name.toLowerCase()}`, this.file);
    task.snapshotChanges().pipe(finalize(() => {
      this.downloadURL = fileRef.getDownloadURL();
      this.downloadURL.subscribe(url => {
        if (url) {
          this.fb = url;
        }
        console.log(this.fb);
      });
    })).subscribe(url => {
      if (url) {
        console.log(url);
      }
    });
    if(this.valid == true) {
      this.movieForm.releaseDate = this.movieForm.releaseDate.substring(8, 10) + '/' + this.movieForm.releaseDate.substring(5, 7) + '/' + this.movieForm.releaseDate.substring(0, 4);
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
        genres: this.genreSelected,
        type: this.typeSelected
      })
      this.dismissModal();
    } else {
      console.log('Ajout impossible', this.movieForm);
    }
  }

  onSelectCinema(event) {
    this.cinemaSelected = event.detail.value;
    console.log(this.cinemaSelected);
    this.movieForm.cinemaList = this.cinemaSelected;
  }

  checkForm() {
    if(this.movieForm.cinemaList.length <= 0) {
      console.log('Error : cinemaList');
    }
    else if(this.movieForm.duration == '') {
      console.log('Error : Duration');
    }
    else if(this.movieForm.name == '') {
      console.log('Error : Name');
    }
    else if(this.movieForm.producerName == '') {
      console.log('Error : ProducerName');
    }
    else if(this.movieForm.releaseDate == '') {
      console.log('Error : ReleaseDate');
    }
    else if(this.movieForm.synopsis == '') {
      console.log('Error : Synopsis');
    }
    else if(this.movieForm.trailer == '') {
      console.log('Error : Trailer');
    }
    else {
      this.valid = true;
    }
  }

  dismissModal(object?) {
    this.modalCtrl.dismiss(object);
  }

}
