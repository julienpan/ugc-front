import { Component, OnInit } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usersRef: AngularFireList<any>;
  users: Observable<any[]>;
  

  user = {
    email : '',
    password: '',
  }

  constructor(    
    private activatedRoute: ActivatedRoute,
    public afDB: AngularFireDatabase) { }

  ngOnInit() {
    // this.home = this.activatedRoute.snapshot.paramMap.get('id');
    this.getUsers()
  }

  getUsers() {
    this.usersRef = this.afDB.list('users');
    this.users = this.usersRef.valueChanges();
    this.users.subscribe(res => console.log(res));
  }

  add() {
    this.afDB.list('users/').push({
      email: this.user.email,
      password: this.user.password,
    });
  }

}
