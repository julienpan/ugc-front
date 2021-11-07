import { Component, OnInit } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/compat/database';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public menu: string;
  segment: 'films' | 'cinemas' = 'films';


  constructor(
    private activatedRoute: ActivatedRoute,
    public afDB: AngularFireDatabase
    ) {}

  ngOnInit() {
    this.menu = this.activatedRoute.snapshot.paramMap.get('id');
  }

  segmentChange($event): void {
    console.log($event);
    this.segment = $event.detail.value;
  }


}