import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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

  constructor(
    private modalCtrl: ModalController,
    private firestore: AngularFirestore,
  ) { }

  ngOnInit() {
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
    })
    this.dismissModal();

  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
