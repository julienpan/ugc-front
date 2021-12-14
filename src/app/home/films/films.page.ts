import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ModalAddMoviePage } from 'src/app/components/modal-add-movie/modal-add-movie.page';
import { ModalCinemaPage } from 'src/app/components/modal-cinema/modal-cinema.page';
import { take } from 'rxjs/operators';
import { snapshotChanges } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';


@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
})
export class FilmsPage implements OnInit {
  slideOpts = {
    slidesPerView: 4.5,
  }

  movieRef: AngularFirestoreCollection<any>;
  movie: Observable<any[]>;

  movieList = [{
    id: '',
    name: '',
    releaseDate: '',
    genres: [],
    note: 0,
    duration: '',
    producerName: '',
    synopsis: '',
    image: '',
    trailer: '',
    cinemaList: [],
    type: '',
  }]

  recommendedMovieList = [];
  basicMovieList = [];
  frontMovieList = [];
  previewMovieList = [];
  newMovieList = [];

  prefList = [];

  genreRef: AngularFirestoreCollection<any>;
  genre: Observable<any[]>;
  genreList = [];

  userRef: AngularFirestoreCollection<any>;
  user: Observable<any[]>;

  isAdmin : boolean = false;
  deleteMode : boolean = false;

  innerWidth: any;

  constructor(
    private modalCtrl: ModalController,
    private firestore: AngularFirestore,
    private router: Router,
    private adminService: AdminService,
    private firebaseAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    if(localStorage.getItem('admin') != null) {
      this.isAdmin = true;
      console.log('Mode admin');
    } else {
      this.isAdmin = false;
      console.log('Mode User');
    }

    this.innerWidth = window.innerWidth;
    if(this.innerWidth <= 500) {
      this.slideOpts.slidesPerView = 1.3;
    } else if(this.innerWidth > 500 && this.innerWidth <= 700) {
      this.slideOpts.slidesPerView = 2.5;
    } else if(this.innerWidth > 700 && this.innerWidth <= 1000) {
      this.slideOpts.slidesPerView = 3.5;
    } else {
      this.slideOpts.slidesPerView = 4.5;
    }

    this.getAllMovies();
    this.getAllGenre();

  }

  refresh() {
    this.getAllMovies();
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
    this.getUserPref();
  }

  getUserPref() {
    this.user = this.firestore.collection('users').valueChanges();
    this.user.forEach(r => {
      r.forEach(r2 => {
        if(localStorage.getItem('user')) {
          if(localStorage.getItem('user').match(r2.email)) {
            // console.log(r2);
            r2.preferences.forEach(r3 => {
              this.prefList.push(r3);
              
              this.movieList.forEach(r => {
                r.genres.forEach(r2 => {
                  if(r2.toLowerCase() == r3) {
                    if(!this.recommendedMovieList.includes(r)) {
                      this.recommendedMovieList.push(r);
                    }
                  }
                })
              })
            })
          }
        } 
      })
    })
  }




  getAllMovies() {
    this.movie = this.firestore.collection('movie').valueChanges({idField: 'customId'}).pipe(take(1))
    this.movie.forEach((r) => {
      r.forEach((r2) => {
        this.movieList.push({
          id: r2.customId,
          name: r2.name,
          releaseDate: r2.releaseDate,
          genres: r2.genres,
          note: r2.note,
          duration: r2.duration,
          producerName: r2.producerName,
          synopsis: r2.synopsis,
          image: r2.image,
          trailer: r2.trailer,
          cinemaList: r2.cinemaList,
          type: r2.type
        });
        if(r2.type == 'NOUVEAU') {
          this.newMovieList.push(r2);
        } else if (r2.type == 'AVANT-PREMIERE') {
          this.previewMovieList.push(r2);
        } else if(r2.type == 'EN-AVANT') {
          this.frontMovieList.push(r2);
        } else {
          this.basicMovieList.push(r2);
        }
      });
    }).catch(e => {
      console.log(e);
    })
    this.movieList.pop();
    // console.log('movie LIST', this.movieList);
    // console.log('NEW : ', this.newMovieList);
    // console.log('PREVIEW : ', this.previewMovieList);
    // console.log('FRONT : ', this.frontMovieList);
    // console.log('BASIC : ', this.basicMovieList);

  }


  watchTrailer(link) {
    window.open(link, "_blank");
  }

  deleteMovie(movie) {
    console.log(movie);
    const movieRef = this.firestore.collection('movie');
    (movieRef.doc(movie.id).delete());
    // this.refresh();
  }


  async openModalAddMovie() {
    const modal = await this.modalCtrl.create({
      component: ModalAddMoviePage,
    });
    // modal.onDidDismiss().then((data) => {
    //   if(data.role != 'backdrop') {
    //     this.refresh();
    //   }
    // })
    return await modal.present();
  }

  async openModalCinema() {
    const modal = await this.modalCtrl.create({
      component: ModalCinemaPage,
    });
    return await modal.present();
  }

}
