import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  constructor(public navCtrl: NavController, public geolocation: Geolocation) {

  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){

    this.geolocation.getCurrentPosition().then((position) =>{
    
      let latLng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

       let mapOptions = {
        center: latLng, 
        zoom: 15
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });

    }, (err) =>{
      console.log(err);
    })

  }


}