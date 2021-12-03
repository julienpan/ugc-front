import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';

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
  }

  // cinemaRef: AngularFirestoreCollection<any>;
  cinema: Observable<any[]>;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private firestore: AngularFirestore,
    private modalCtrl: ModalController
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

  addCinema() {
    const cinemaRef = this.firestore.collection('cinema');
    cinemaRef.doc(this.cinemaForm.name).set({
      name: this.cinemaForm.name,
      address: this.cinemaForm.addressForm,
    })
    this.dismissModal();
  }

  dismissModal() {
    this.modalCtrl.dismiss();
  }
}
