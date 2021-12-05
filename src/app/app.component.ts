import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { FirebaseService } from './services/firebase.service';
// import { initializeApp } from "firebase/app";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Accueil', url: '/home/accueil', icon: 'home' },
    { title: 'News', url: '/home/news', icon: 'newspaper' },
    // { title: 'Connexion', url: '/home/login', icon: 'person' },
    // { title: 'Inscription', url: '/home/register', icon: 'person' },
  ];

  isLoggedIn : boolean = false;

  constructor(
    private platform: Platform,
    private menu: MenuController,
    private firebaseService: FirebaseService,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('APP READY !');
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
