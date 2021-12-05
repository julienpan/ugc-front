import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ModalAddMoviePage } from 'src/app/components/modal-add-movie/modal-add-movie.page';

@Component({
  selector: 'app-films',
  templateUrl: './films.page.html',
  styleUrls: ['./films.page.scss'],
})
export class FilmsPage implements OnInit {
  slideOpts = {
    slidesPerView: 5.1,
  }

  movieRef: AngularFirestoreCollection<any>;
  movie: Observable<any[]>;

  movieList = [{
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
  }]

  constructor(
    private modalCtrl: ModalController,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
    this.movieList = [];
    this.getAllMovies();
  }

  refresh() {
    this.getAllMovies();
  }

  getAllMovies() {
    this.movieList = [];
    this.movie = this.firestore.collection('movie').valueChanges({idField: 'customId'});
    this.movie.forEach((r) => {
      r.forEach((r2) => {
        console.log('ID : ', r2.customId);
        this.movieList.push({
          name: r2.name,
          releaseDate: r2.releaseDate,
          genres: r2.genres,
          note: r2.note,
          duration: r2.duration,
          producerName: r2.producerName,
          synopsis: r2.synopsis,
          image: r2.image,
          trailer: r2.trailer,
          cinemaList: r2.cinemaList
        });
      });
    });
    this.movieList.pop();
    console.log('movie LIST', this.movieList);
  }

  watchTrailer(link) {
    console.log(link);
    window.open(link, "_blank");
    // window.location.href = link;
  }


  async openModalAddMovie() {
    const modal = await this.modalCtrl.create({
      component: ModalAddMoviePage,
    });
    
    modal.onDidDismiss().then(() => {
      this.refresh();
    })

    return await modal.present();
  }

}
