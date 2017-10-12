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
  pairedDeviceName: any;
  pairedDeviceAddress: any;
  gettingDevices: Boolean;
  private headers = new Headers({ 'Content-Type': 'application/json' });

  constructor(private bluetoothSerial: BluetoothSerial, public navCtrl: NavController, public geolocation: Geolocation, private alertCtrl: AlertController) {
    bluetoothSerial.enable();

      this.bluetoothSerial.list().then((success) => {
              console.log('Inside List ' + success);
              this.pairedDevices = success;
              for (let i = 0; i < this.pairedDevices.length; i++) {
                  console.log(this.pairedDevices[i].name + " : " + this.pairedDevices[i].address);
                      this.pairedDeviceName = this.pairedDevices[i].name;
                      this.pairedDeviceAddress = this.pairedDevices[i].address;

                      console.log(this.pairedDeviceName + " : " + this.pairedDeviceAddress);
                      console.log("Trying to connect");
                      this.bluetoothSerial.connect(this.pairedDeviceAddress).subscribe(this.success, this.fail);
              }
          },
          (err) => {
              console.log('his.bluetoothSerial.list error' + err);
          });
  }
  ionViewDidLoad() {
    // this.loadMap();
  }

  write() {
    this.bluetoothSerial.write("hello, world");
  }

  success = (data) => alert(data);
  fail = (error) => alert(error);


  emergencyButtonPressed() {
    clearInterval(intervalFunction);
    intervalFunction = setInterval(() => {
      this.geolocation.getCurrentPosition().then((position) => {
        if (!this.map) {
          this.initMap(position.coords.latitude, position.coords.longitude);
        }
        else {
          this.updateMap(position.coords.latitude, position.coords.longitude);
        }
        console.log("skicka pos: " + position.coords.latitude + " " + position.coords.longitude)

        this.postLocation(position.coords.latitude, position.coords.longitude);

      }, (err) => {
        console.log(err);
      })
    }, 2000);
  }

  initMap(lat, long) {
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

  updateMap(lat, long) {
    new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });
  }

  postLocation(lat, long) {
    //'http://localhost:3000/location'

    /*     $fh.cloud({
          "path": '/location',
          "method": "POST",
          data: {
            longitude: long,
            latitude: lat
          }
        }, function (res) {
          console.log('success: ', res);
        }, function (err) {
          console.log("error");
        }); */

    $fh.cloud({
      path: 'hello', //only the path part of the url, the host will be added automatically
      method: 'POST', //all other HTTP methods are supported as well. For example, HEAD, DELETE, OPTIONS
      contentType: 'application/json',
      data: { longitude: long, latitude: lat }, //data to send to the server
      timeout: 25000 // timeout value specified in milliseconds. Default: 60000 (60s)
    }, function (res) {
      // Cloud call was successful. Alert the response
      //alert('Got response from cloud:' + JSON.stringify(res));
    }, function (msg, err) {
      // An error occurred during the cloud call. Alert some debugging information
      //alert('Cloud call failed with error message:' + msg + '. Error properties:' + JSON.stringify(err));
    });

    /*this.http.post('https://polisen-raukdn4hwmk5hf54qybpwwkq-dev.mbaas1.tom.redhatmobile.com/location', JSON.stringify({lat: latitude, long: longitude}), {headers: this.headers}).subscribe(res => {
          console.log("successs");
        });*/

  }
}
