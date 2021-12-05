import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  isLoggedIn: boolean = false;

  constructor(
    public firebaseAuth: AngularFireAuth,
  ) { }

  async login(email: string, password: string) {
    await this.firebaseAuth.signInWithEmailAndPassword(email, password).then((res) => {
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user));
    });
  }

  async register(email: string, password: string) {
    await this.firebaseAuth.createUserWithEmailAndPassword(email, password).then((res) => {
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user));
    });
  }

  logout() {
    this.firebaseAuth.signOut();
    localStorage.removeItem('user');
    if(localStorage.getItem('admin') != null) {
      localStorage.removeItem('admin');
    }
  }
}
