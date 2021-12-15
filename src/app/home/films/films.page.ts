import { Component, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { IonSlides, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ModalAddMoviePage } from 'src/app/components/modal-add-movie/modal-add-movie.page';
import { ModalCinemaPage } from 'src/app/components/modal-cinema/modal-cinema.page';
import { take } from 'rxjs/operators';
import { snapshotChanges } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MapsAPILoader } from '@agm/core';
import { MovieList } from 'src/app/interfaces/movie-list';
import { AddressForm } from 'src/app/interfaces/address-form';
import { CinemaList } from 'src/app/interfaces/cinema-list';



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

  movieList : MovieList[] = [];
  // = [{
  //   id: '',
  //   name: '',
  //   releaseDate: '',
  //   genres: [],
  //   note: 0,
  //   duration: '',
  //   producerName: '',
  //   synopsis: '',
  //   image: '',
  //   trailer: '',
  //   cinemaList: [],
  //   type: '',
  // }]

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

  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  public geoCoder;

  errorForm = '';

  addressForm : AddressForm;
  // = {
  //   city: '',
  //   country: '',
  //   fullAddress: '',
  //   latitude: 0,
  //   longitude: 0,
  //   street: '',
  //   street_2: '',
  //   zipCode: ''
  // }

  @ViewChild("mySlides") slides: IonSlides;
  @ViewChild("mySlides2") slides2: IonSlides;
  @ViewChild("mySlides3") slides3: IonSlides;
  @ViewChild("mySlides4") slides4: IonSlides;
  @ViewChild("mySlides5") slides5: IonSlides;




  constructor(
    private modalCtrl: ModalController,
    private firestore: AngularFirestore,
    private router: Router,
    private adminService: AdminService,
    private firebaseAuth: AngularFireAuth,
    private firestorage: AngularFireStorage,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
  ) { }

  // slide(index) {
  //   this.slides.slideTo(index)
  // }

  slide(event) {
    console.log(event);
  }

  ngOnInit() {

    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
    }).catch(e => {
      console.log(e);
    })

    if(localStorage.getItem('admin') != null) {
      this.isAdmin = true;
      console.log('Mode admin');
    } else {
      this.isAdmin = false;
      console.log('Mode User');
    }

    this.innerWidth = window.innerWidth;
    if(this.innerWidth <= 500) {
      this.slideOpts.slidesPerView = 1.1;
    } else if(this.innerWidth > 500 && this.innerWidth <= 700) {
      this.slideOpts.slidesPerView = 1.5;
    } else if(this.innerWidth > 700 && this.innerWidth <= 1000) {
      this.slideOpts.slidesPerView = 2.5;
    } else {
      this.slideOpts.slidesPerView = 3.5;
    }
    this.getAllMovies();
    this.getAllGenre();
  }

  refresh() {
    this.getAllMovies();
  }

  getAddress(latitude, longitude): boolean {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      this.ngZone.run(() => {
        console.log('RESULTS', results);
        console.log('STATUS', status);
        if (status === 'OK') {
          if (results[0]) {
            this.zoom = 12;
            this.address = results[0].formatted_address;
            this.addressForm.fullAddress = results[0].formatted_address;
            this.addressForm.latitude = latitude
            this.addressForm.longitude = longitude
            console.log(this.addressForm.fullAddress);

            for (const component of results[0].address_components) {
              // console.log(component);
              if (component.types.includes('street_number'))
                this.addressForm.street = component.long_name
              else if (component.types.includes('route'))
                this.addressForm.street_2 = component.long_name
              else if (component.types.includes('locality'))
                this.addressForm.city = component.long_name
              else if (component.types.includes('country'))
                this.addressForm.country = component.long_name
              else if (component.types.includes('postal_code'))
                this.addressForm.zipCode = component.long_name
            }
          } else {
            window.alert('No results found');
            return false
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
          return false
        }
      })
    });
    return true
  }


  getAllGenre() {
    console.log('GET ALL GENRE');
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
    console.log('GET ALL PREF');
    this.user = this.firestore.collection('users').valueChanges();
    this.user.forEach(r => {
      r.forEach(r2 => {
        if(localStorage.getItem('user')) {
          console.log('LOCAL STORAGE USER FOUND');
          if(localStorage.getItem('user').match(r2.email)) {
            // console.log(r2);
            console.log('USER TROUVER', r2.email)
            r2.preferences.forEach(r3 => {
              this.prefList.push(r3);
              console.log('LISTE DES PREFERENCES', this.prefList);

              this.movieList.forEach(r => {
                r.genres.forEach(r2 => {
                  if(r2.toLowerCase() == r3.toLowerCase()) {

                    console.log('PREFERENCES ET FILM TROUVE', r);

                    if(!this.recommendedMovieList.includes(r)) {            
                      console.log(r);      
                      this.firestorage.ref(`movieImages/${r.name.toLowerCase()}.jpeg`).getDownloadURL().forEach(r4 => {
                        console.log(r4);
                        this.recommendedMovieList.forEach(r5 => {
                          console.log(r5);
                          if(r5.name == r.name) {
                            r5.image = r4;
                          }
                        })
                      }).catch(e => {
                        console.log('Aucune image pour : ', r, 'ERROR :', e);
                      })
                      this.recommendedMovieList.push(r);
                      console.log(this.recommendedMovieList);
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
        this.firestorage.ref(`movieImages/${r2.name.toLowerCase()}.jpeg`).getDownloadURL().forEach(r => {
          // console.log(r);
          r2.image = r;
        }).catch(e => {
          console.log('Aucune image pour : ', r2, 'ERROR :', e);
        })
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

        r2.type.forEach(r => {
          if(r == 'NOUVEAU') {
            this.newMovieList.push(r2);
          } else if (r == 'AVANT-PREMIERE') {
            this.previewMovieList.push(r2);
          } else if(r== 'EN-AVANT') {
            this.frontMovieList.push(r2);
          }
          this.basicMovieList.push(r2);
        })
      
      });
    }).catch(e => {
      console.log(e);
    })
    this.movieList.pop();
    console.log('movie LIST', this.movieList);
    // console.log('NEW : ', this.newMovieList);
    // console.log('PREVIEW : ', this.previewMovieList);
    // console.log('FRONT : ', this.frontMovieList);
    // console.log('BASIC : ', this.basicMovieList);

  }

  navigateToMovieDetail(movie) {
    let id = movie.name.toLowerCase();
    id = movie.name.replace(/\s*/g, "");
    id = movie.name.replace(/\W/g, "");
    console.log(id);
    this.router.navigateByUrl(`/home/accueil/films/detail/${id}`, {
      state: {
        movie: movie
      }
    });
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

  getCinemaLocation() {

    this.mapsAPILoader.load().then(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 8;
          if (this.getAddress(this.latitude, this.longitude)) {
            this.router.navigateByUrl('/home/accueil/cinema', {
              state: {
                lat: this.latitude,
                lng: this.longitude,
                around: true
              }
            })
            // this.navigateAround()
          }
        }, (positionError) => {
          console.log(positionError)
          this.errorForm = 'Nous ne pouvons pas connaitre votre position, vérifiez dans vos paramètres.'
        })
      }
    })
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
