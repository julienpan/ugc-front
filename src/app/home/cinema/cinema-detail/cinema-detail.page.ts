import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cinema-detail',
  templateUrl: './cinema-detail.page.html',
  styleUrls: ['./cinema-detail.page.scss'],
})
export class CinemaDetailPage implements OnInit {

  cinema : any;

  slideOpts = {
    slidesPerView: 4.5,
  }

  movieRef: AngularFirestoreCollection<any>;
  movie: Observable<any[]>;

  movieList = [];

  innerWidth: any;

  constructor(
    private router: Router,
    private firestorage: AngularFireStorage,
    private firestore: AngularFirestore
  ) { }

  ngOnInit() {

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

    this.cinema = history.state.cinema != null ? history.state.cinema : null;
    if(this.cinema == null) {
      this.router.navigateByUrl('/home/accueil/cinema');
    }

    if(!this.cinema.image) {
      console.log('AUCUNE IMAGE');
      this.cinema.name = this.cinema.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      console.log(`cinemaImages/${this.cinema.name}.jpeg`);
      this.firestorage.ref(`cinemaImages/${this.cinema.name}.jpeg`).getDownloadURL().forEach(r => {
        this.cinema.image = r;
      }).catch(e => {
        console.log('Aucune image pour : ', this.cinema.name, 'ERROR :', e);
      })
    }
    this.getMovieByCinema();
    // console.log(this.cinema);
  }

  getMovieByCinema() {
    this.movieRef = this.firestore.collection('movie');
    this.movie = this.movieRef.valueChanges();
    this.movie.forEach(r => {
      r.forEach(r2 => {
        // console.log(r2);
        r2.cinemaList.forEach(r3 => {
          r3 = r3.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          this.cinema.name = this.cinema.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
          // console.log(r3, this.cinema.name);
          if(r3 == this.cinema.name) {
            this.firestorage.ref(`movieImages/${r2.name.toLowerCase()}.jpeg`).getDownloadURL().forEach(r => {
              r2.image = r;
            }).catch(e => {
              console.log('Aucune image pour : ', r2, 'ERROR :', e);
            })
            if(!this.cinema.movieList.includes(r2.name) || !this.cinema.movieList.includes(r2)) {
              // console.log(r2);
              this.cinema.movieList.push(r2);
            }
            // console.log('TROUVE', this.cinema.movieList);

          }
        })
      })
    })
    // console.log(this.cinema);
  } 

  watchTrailer(link) {
    window.open(link, "_blank");
  }

}
