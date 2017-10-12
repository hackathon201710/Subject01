import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
//import { MediaCapture } from '@ionic-native/media-capture';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import * as $fh from 'fh-js-sdk';

declare var google;
var intervalFunction;
//declare var cordova;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: Boolean;
  private headers = new Headers({'Content-Type': 'application/json'});


  constructor(private bluetoothSerial: BluetoothSerial, public navCtrl: NavController, public geolocation: Geolocation, private alertCtrl: AlertController) {
    bluetoothSerial.enable();
  }
  ionViewDidLoad() {
   // this.loadMap();
  }

  startScanning() {
    console.log('Enter startScanning');
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;
    console.log('Before list');
    this.bluetoothSerial.list().then((success) => {
      console.log('Inside List ' + success);
      this.pairedDevices = success;
      debugger;
    },
      (err) => {
        console.log('his.bluetoothSerial.list error' + err);
      })

/*     console.log('Before startScanning');
    this.bluetoothSerial.discoverUnpaired().then((success) => {
      console.log('Inside startScanning');
      this.unpairedDevices = success;
      this.gettingDevices = false;
      success.forEach(element => {
        console.log('Inside startScanning success');
        alert(element.name);
      });
    },
      (err) => {
        console.log('startScanning error');
        console.log(err);
      }) */

    this.bluetoothSerial.list().then((success) => {
      this.pairedDevices = success;
    },
      (err) => {

      })
  }
  success = (data) => alert(data);
  fail = (error) => alert(error);

  selectDevice(address: any) {
    let alert = this.alertCtrl.create({
      title: 'Connect',
      message: 'Do you want to connect with?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Connect',
          handler: () => {
            this.bluetoothSerial.connect(address).subscribe(this.success, this.fail);
          }
        }
      ]
    });
    alert.present();
  }

  disconnect() {
    let alert = this.alertCtrl.create({
      title: 'Disconnect?',
      message: 'Do you want to Disconnect?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Disconnect',
          handler: () => {
            this.bluetoothSerial.disconnect();
          }
        }
      ]
    });
    alert.present();
  }


  emergencyButtonPressed(){
    clearInterval(intervalFunction);
    intervalFunction = setInterval(() => {
      this.geolocation.getCurrentPosition().then((position) =>{
        if(!this.map){
          this.initMap(position.coords.latitude, position.coords.longitude);
        }
        else{
          this.updateMap(position.coords.latitude, position.coords.longitude);
        }
        console.log("skicka pos: " + position.coords.latitude + " " +  position.coords.longitude)

        this.postLocation(position.coords.latitude, position.coords.longitude);

      }, (err) =>{
      console.log(err);
    })
  }, 2000);
  }

initMap(lat, long){
    let latLng = new google.maps.LatLng(lat, long);

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
}

  updateMap(lat, long){
      new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });
  }

  postLocation(lat, long){
//'http://localhost:3000/location'

 $fh.cloud({
          path:'location',
          method: "POST",
           data: {
           longitude: long,
            latitude: lat
        }
      }, function(res) {
          console.log('success: ', res);
      }, function(err) {
          console.log("error");
      });

  /*this.http.post('https://polisen-raukdn4hwmk5hf54qybpwwkq-dev.mbaas1.tom.redhatmobile.com/location', JSON.stringify({lat: latitude, long: longitude}), {headers: this.headers}).subscribe(res => {
        console.log("successs");
      });*/

}
}
