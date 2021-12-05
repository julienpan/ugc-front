import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }


  checkAdmin(object) {
    if(object.includes('admin@admin.com')) {
      return true;
    } else {
      return false;
    }
  }

}
