import { Component, OnInit } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFirestoreModule, AngularFirestoreCollection, AngularFirestoreCollectionGroup, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/compat/firestore/'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usersRef: AngularFireList<any>;
  users: Observable<any[]>;

  clientRef: AngularFirestoreCollection<any>;
  client: Observable<any[]>;
  

  user = {
    email : '',
    password: '',
  }

  constructor(    
    private activatedRoute: ActivatedRoute,
    public afDB: AngularFireDatabase,
    public firestore: AngularFirestore) { }

  ngOnInit() {
    // this.home = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUsers()

  }


  getUsers() {
    // this.usersRef = this.afDB.list('client');
    // this.users = this.usersRef.valueChanges();
    // this.users.subscribe(res => console.log(res));

    this.clientRef = this.firestore.collection('client');
    this.client = this.clientRef.valueChanges();
    this.client.subscribe(res => console.log(res));
  }

  add() {
    this.firestore.collection('client/').add({
      lastname: 'PAN',
      firstname: 'Julien',
      login: this.user.email,
      password: this.user.password,
      email: this.user.email,
      preferences: ['RIEN']
    }).then(r => {
      console.log(r);
    })
    // this.afDB.list('client/').push({
    //   email: this.user.email,
    //   password: this.user.password,
    // });
  }

}
