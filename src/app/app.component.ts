import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { AdminService } from './services/admin.service';
import { FirebaseService } from './services/firebase.service';
// import { initializeApp } from "firebase/app";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Films', url: '/home/accueil/films', icon: 'film' },
    { title: 'Cinéma', url: '/home/accueil/cinema', icon: 'videocam' },
  ];

  isLoggedIn : boolean = false;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private firebaseService: FirebaseService,
    private adminService: AdminService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('APP READY !');
      if(localStorage.getItem('user') != null) {
        if(this.adminService.checkAdmin(localStorage.getItem('user'))) {
          console.log('Connecté en tant que administrateur')
          localStorage.setItem('admin', 'true');
          console.log(localStorage.getItem('admin'))
        } else {
          console.log('User connecté');
        }
      } else {
        console.log('Non connecté');
      }
    });
  }

  ngOnInit() {
    if(localStorage.getItem('user')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

    console.log(this.isLoggedIn);
  }


  async closeMenu(): Promise<void> {
    await this.menu.close('menu');
  }

  logout() {
    this.firebaseService.logout();
    localStorage.removeItem('user')
    console.log(localStorage);
    console.log('Deconnexion réussi')
  }

}
