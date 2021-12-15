import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit {

  movie : any;

  constructor() { }

  ngOnInit() {
    this.movie = history.state.movie != null ? history.state.movie : null;
    console.log(this.movie);
  }

}