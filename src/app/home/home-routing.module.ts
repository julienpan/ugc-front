import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  },
  {
    path: 'cinema',
    loadChildren: () => import('./cinema/cinema.module').then( m => m.CinemaPageModule)
  },
  {
    path: 'films',
    loadChildren: () => import('./films/films.module').then( m => m.FilmsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
