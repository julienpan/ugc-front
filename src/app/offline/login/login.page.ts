import { Component, OnInit, Output } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestoreModule,
        AngularFirestoreCollection, 
        AngularFirestoreCollectionGroup, 
        AngularFirestoreDocument, 
        AngularFirestore } from '@angular/fire/compat/firestore/'; 
import { collection, doc, setDoc } from "firebase/firestore"; 
import { FirebaseService } from 'src/app/services/firebase.service';
import { EventEmitter } from 'stream';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  segmentForm : 'login' | 'register' = 'login';

  form: {
    value: 'login' | 'register';
    disable: boolean;
  }[] = [
    { value: "login", disable: false },
    { value: "register", disable: false },
  ];

  clientRef: AngularFirestoreCollection<any>;
  client: Observable<any[]>;

  user = {
    email: '',
    firstname: '',
    lastname: '',
    login: '',
    password: '',
    preferences: [],
  }

  loginEmail = '';
  loginPassword = '';

  // 'animation','comedie','drame','documentaire','fantastique', 'science-fiction', 'horreur', 'policier', 'aventure'
  pref = [
    { id: 0, prefName: 'animation', },
    { id: 1, prefName: 'comedie', },
    { id: 2, prefName: 'drame',},
    { id: 3, prefName: 'documentaire',},
    { id: 4, prefName: 'fantastique',},
    { id: 5, prefName: 'science-fiction'},
    { id: 6, prefName: 'horreur',},
    { id: 7, prefName: 'policier'},
    { id: 8, prefName: 'aventure'},
  ];
  prefSelected: any;

  isSignedIn = false;

  genreRef: AngularFirestoreCollection<any>;
  genre: Observable<any[]>;
  genreList = [];

  constructor(    
    private activatedRoute: ActivatedRoute,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore,
    public firebaseService: FirebaseService,
    private router: Router,
    ) { }

  ngOnInit() {
    if(localStorage.getItem('user') !== null) {
      console.log(localStorage);
      this.isSignedIn = true;
    } else {
      this.isSignedIn = false;
    }
    // this.getUsers()
    this.getAllGenre();
  }

  getAllGenre() {
    // console.log('GET ALL GENRE');
    this.genre = this.firestore.collection('genres').valueChanges();
    this.genre.forEach(r => {
      r.forEach(r2 => {
        r2.genresList.forEach(r3 => {
          if(!this.genreList.includes(r3)) {
            this.genreList.push(r3);
          }
        })
      })
    })
  }

  async onRegister(email: string, password: string) {
    await this.firebaseService.register(email, password);
    if(this.firebaseService.isLoggedIn) {
      this.isSignedIn = true;
      console.log('Connect??');
      // this.router.navigateByUrl('/home/accueil');
      window.location.href = './';
    } else {
      this.isSignedIn = false;
    }
  }

  async onLogIn(email: string, password: string) {
    // email = email.toString().toLowerCase().trim();
    await this.firebaseService.login(email, password);
    if(this.firebaseService.isLoggedIn) {
      this.isSignedIn = true;
      // this.router.navigateByUrl('/home/accueil');
      window.location.href = './';
      console.log('Connect??');
      
    } else {
      this.isSignedIn = false;
    }
  }

  logout() {
    this.firebaseService.logout();
  }

  // getUsers() {
  //   this.clientRef = this.firestore.collection('users');
  //   this.client = this.clientRef.valueChanges();
  // }

  add() {
    this.prefSelected.forEach(r => {
      if(!this.user.preferences.includes(r))
        this.user.preferences.push(r);
    })

    const userRef = this.firestore.collection('users');
    userRef.doc(this.user.email).set({
      lastname: this.user.lastname,
      firstname: this.user.firstname,
      email: this.user.email,
      password: this.user.password,
      preferences: this.user.preferences
    });

    this.user.lastname = "";
    this.user.firstname = "";
    this.user.password= "";
    this.user.email = "";
    this.prefSelected = [];
  }

  changePref($event) {
    console.log($event);
    this.prefSelected = $event.detail.value
  }

  segmentChanged($event) {
    console.log($event);
    this.segmentForm = $event.detail.value;
  }

}
