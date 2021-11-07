import { Component } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
// import { initializeApp } from "firebase/app";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  {
  public appPages = [
    { title: 'Accueil', url: '/home/accueil', icon: 'home' },
    { title: 'News', url: '/home/news', icon: 'newspaper' },
    { title: 'Connexion', url: '/home/login', icon: 'person' },
    { title: 'Inscription', url: '/home/register', icon: 'person' },
    // { title: 'Archived', url: '/home/Archived', icon: 'archive' },
    // { title: 'Trash', url: '/home/Trash', icon: 'trash' },
    // { title: 'Spam', url: '/home/Spam', icon: 'warning' },
  ];

  constructor(
    private platform: Platform,
    private menu: MenuController,
  ) {}

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('APP READY !');
    });
  }


  async closeMenu(): Promise<void> {
    await this.menu.close('menu');
  }

}
