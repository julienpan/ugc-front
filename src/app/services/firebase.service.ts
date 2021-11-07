import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
  ) { }

  // getRealtimeDbMessages(): Observable<any> {
  //   return this.afDB.list<Message>('message')
  // }
}
