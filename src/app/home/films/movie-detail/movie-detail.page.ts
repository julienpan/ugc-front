import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.page.html',
  styleUrls: ['./movie-detail.page.scss'],
})
export class MovieDetailPage implements OnInit {

  movie : any;

  showCinemaList : boolean = false;

  cinemaList : any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.movie = history.state.movie != null ? history.state.movie : null;
    console.log(this.movie);
    if(this.movie == null) {
      this.router.navigateByUrl('/home/accueil/films')
    }
  }

  getCinemaAvailable(cinemaList) {
    // console.log(cinemaList);
    this.cinemaList = cinemaList;
  }

  goToCinemaPage(cinema) {
    console.log(cinema);
  }

}
