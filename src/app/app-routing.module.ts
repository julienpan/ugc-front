import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/accueil/films',
    pathMatch: 'full'
  },
  {
    path: 'home/:id',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./offline/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'modal-cinema',
    loadChildren: () => import('./components/modal-cinema/modal-cinema.module').then( m => m.ModalCinemaPageModule)
  },
  {
    path: 'modal-add-cinema',
    loadChildren: () => import('./components/modal-add-cinema/modal-add-cinema.module').then( m => m.ModalAddCinemaPageModule)
  },
  {
    path: 'modal-add-movie',
    loadChildren: () => import('./components/modal-add-movie/modal-add-movie.module').then( m => m.ModalAddMoviePageModule)
  },
  // {
  //   path: 'home',
  //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
