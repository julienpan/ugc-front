import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.page.html',
  styleUrls: ['./cinema.page.scss'],
})
export class CinemaPage implements OnInit {


  segmentForm : 'tous' | 'paris' | 'bordeaux' | 'hautsDeFrance' | 'lyon' | 'nantes' | 'toulouse' = 'tous';

  form: {
    value: 'tous' | 'paris' | 'bordeaux' | 'hautsDeFrance' | 'lyon' | 'nantes' | 'toulouse';
    disable: boolean;
  }[] = [
    { value: "tous", disable: false },
    { value: "paris", disable: false },
    { value: "bordeaux", disable: false },
    { value: "hautsDeFrance", disable: false },
    { value: "lyon", disable: false },
    { value: "nantes", disable: false },
    { value: "toulouse", disable: false },
  ];

  constructor() { }

  ngOnInit() {
  }


  segmentChanged($event) {
    console.log($event);
  }

}
