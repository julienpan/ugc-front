import { Component, OnInit } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestoreModule,
        AngularFirestoreCollection, 
        AngularFirestoreCollectionGroup, 
        AngularFirestoreDocument, 
        AngularFirestore } from '@angular/fire/compat/firestore/'; 
import { collection, doc, setDoc } from "firebase/firestore"; 


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

  user = [{
    email: '',
    firstname: '',
    lastname: '',
    login: '',
    password: '',
    preferences: [],
  }]

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
  prefSelected: [];

  constructor(    
    private activatedRoute: ActivatedRoute,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore) { }

  ngOnInit() {
    console.log('PREF:', this.pref);
    // this.home = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUsers()
  }

  getUsers() {
    this.clientRef = this.firestore.collection('client');
    this.client = this.clientRef.valueChanges();

    this.client.forEach(r => {
      r.forEach(r2 => {
        if(r2.firstname == 'Julien') {
          console.log('USER : ', r2);
        }
      })
    })
    // console.log(this.user);
  }

  add() {
    this.firestore.collection('client').add({
      lastname: this.user['lastname'],
      firstname: this.user['firstname'],
      login: this.user['login'],
      password: this.user['password'],
      email: this.user['email'],
      preferences: this.prefSelected,
    })

    this.user['lastname'] = "";
    this.user['firstname'] = "";
    this.user['login'] = "";
    this.user['password'] = "";
    this.user['email'] = "";
    this.prefSelected = [];
  }

  changePref($event) : void {
    console.log($event);
    this.prefSelected = $event.detail.value;
  }

  segmentChanged($event) {
    console.log($event);
    this.segmentForm = $event.detail.value;
  }

}
