import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-modal-add-cinema',
  templateUrl: './modal-add-cinema.page.html',
  styleUrls: ['./modal-add-cinema.page.scss'],
})
export class ModalAddCinemaPage implements OnInit {

  @ViewChild('search',{static:false})
  public searchElementRef: ElementRef

  cinemaForm = {
    addressForm : {
      fullAddress: '',
      street: '',
      street_2: '',
      city: '',
      country: '',
      zipCode: '',
      latitude: 0,
      longitude: 0,
    },
    name: '',
    image: '',
    movieList: [],
  }

  // cinemaRef: AngularFirestoreCollection<any>;
  cinema: Observable<any[]>;

  // title = "cloudsSorage";
  // fb : any;
  // selectedFile: File = null;
  // downloadURL: Observable<string>;

  // file : any;
  // filePath : any;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private firestore: AngularFirestore,
    private modalCtrl: ModalController,
    private firestorage: AngularFireStorage
  ) { }

  ngOnInit() {

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ["address"],
        componentRestrictions : {
          country: 'fr'
        }
      });
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          console.log('place', place)
          //set latitude, longitude and zoom
          this.cinemaForm.addressForm.fullAddress = place.formatted_address;
          this.cinemaForm.addressForm.street = place.address_components[0].long_name;
          this.cinemaForm.addressForm.street_2 = place.address_components[1].long_name;
          this.cinemaForm.addressForm.city = place.address_components[2].long_name;
          this.cinemaForm.addressForm.country = place.address_components[5].long_name;
          this.cinemaForm.addressForm.zipCode = place.address_components[6].long_name;
          this.cinemaForm.addressForm.latitude = place.geometry.location.lat();
          this.cinemaForm.addressForm.longitude = place.geometry.location.lng();
          console.log('cinemaForm.AddressForm : ', this.cinemaForm.addressForm);
        });
      });
    });
  }

  // onFileSelected(event) {
  //   this.file = event.target.files[0];
  //   this.filePath = `movieImages/${this.file.name.toLowerCase()}`;
  // }

  addCinema() {

    // const fileRef = this.firestorage.ref(this.filePath);
    // const task = this.firestorage.upload(`cinemaImages/${this.file.name.toLowerCase()}`, this.file);
    // console.log(task);
    // task.snapshotChanges().pipe(finalize(() => {
    //   this.downloadURL = fileRef.getDownloadURL();
    //   this.downloadURL.subscribe(url => {
    //     if (url) {
    //       this.fb = url;
    //     }
    //   console.log(this.fb);
    //   });
    // })).subscribe(url => {
    //   if (url) {
    //     console.log(url);
    //   }
    // });

    const cinemaRef = this.firestore.collection('cinema');
    cinemaRef.doc(this.cinemaForm.name).set({
      name: this.cinemaForm.name,
      address: this.cinemaForm.addressForm,
      image: this.cinemaForm.image,
      movieList: this.cinemaForm.movieList,
    })
    this.dismissModal();
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
