import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})

export class NewsPage implements OnInit {

  html: any;
  oReq: any;

  title = 'read-xml-angular8';  
  public xmlItems: any;

  urlPhpFile = "./assets/phpFile/url.php";
  urlXmlFile = "./assets/actualites.xml";

  urlList = [];
  urlListName = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
  ){
    // this.loadXML();
  }
  ngOnInit() {
    this.httpClient.get("https://www.allocine.fr/xml/rss", {
      responseType: 'text',
    }).subscribe((data) => {
      const words = data.split('<a target=\"_blank\" href=\"');
      // console.log(words);
      this.getHtmlUrl(words);
    })
  }

  getHtmlUrl(data) {
    // console.log(data);
    for(let i = 1; i < data.length; i++) {
      const url = data[i].split('\"');
      // console.log(url)
      if(!this.urlList.includes(url[0])) {
        this.urlList.push(url[0]);
      }
    }
    console.log(this.urlList);
    this.getNameUrl(this.urlList);
  }

  getNameUrl(data) {
    for(let i = 0; i < data.length; i++) {
      const name = data[i].split('/');
      // console.log(name);
      if(!this.urlListName.includes(name[name.length - 1])) {
        this.urlListName.push({
          mot1: name[name.length - 2],
          mot2: name[name.length - 1]
        })
      }
    }
    console.log(this.urlListName);
  }


  // loadXML() {
  //   this.httpClient.get('./assets/actualites.xml', {
  //     headers: new HttpHeaders()
  //       .set('Content-Type', 'text/xml')
  //       .append('Access-Control-Allow-Methods', 'GET')
  //       .append('Access-Control-Allow-Origin', '*')
  //       .append('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Request-Method"),
  //       responseType: 'text'
  //   }).subscribe((data => {
  //     this.parseXML(data).then((data) => {
  //       this.xmlItems = data;
  //     })
  //   }))
  // }
}
