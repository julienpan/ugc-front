import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {

  userRef: AngularFirestoreCollection<any>;
  user: Observable<any[]>;
  
  genreRef: AngularFirestoreCollection<any>;
  genre: Observable<any[]>;
  genreList = [{
    value: '',
    checked: false,
  }];
  prefList = [];

  userEmail: any;

  constructor(
    private firestore: AngularFirestore,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userRef = this.firestore.collection('users');
    this.user = this.userRef.valueChanges();
    this.user.forEach(r => {
      r.forEach(r2 => {
        if(localStorage.getItem('user').match(r2.email)) {
          this.userEmail = r2;
          this.getAllGenre();
        }
      })
    })
  }

  getAllGenre() {
    // console.log('GET ALL GENRE');
    this.genre = this.firestore.collection('genres').valueChanges();
    this.genre.forEach(r => {
      r.forEach(r2 => {
        r2.genresList.forEach(r3 => {
          if(!this.genreList.includes(r3)) {
            this.genreList.push({
              value: r3,
              checked: false,
            })
            this.getUserPref();
          }
        })
      })
    })
    this.genreList.shift();

  }

  getUserPref() {
    // console.log('GET ALL PREF');
    this.user = this.firestore.collection('users').valueChanges();
    this.user.forEach(r => {
      r.forEach(r2 => {
        if(localStorage.getItem('user')) {
          if(localStorage.getItem('user').match(r2.email)) {
            r2.preferences.forEach(r3 => {
              // console.log(r3);
              this.genreList.forEach(r4 => {
                // console.log(r4);
                if(r4.value.toLowerCase() == r3.toLowerCase()) {
                  r4.checked = true;
                }
              })
            })
          }
        } 
      })
    })
  }

  save() {
    let list = [];
    this.genreList.forEach(r => {
      if(r.checked == true) {
        list.push(r.value);
      } else {
        list = list.filter((value) => value != r.value);
      }
    })
    const userRef = this.firestore.collection('users');
    userRef.doc(this.userEmail.email).set({
      email: this.userEmail.email,
      firstname: this.userEmail.firstname,
      lastname: this.userEmail.lastname,
      password: "",
      preferences: list
    });

    this.router.navigateByUrl('/home/accueil/films');
  }

}
