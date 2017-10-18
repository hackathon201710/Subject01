# Subject01
Subject01


## Links used to develop this
* https://blog.thirdrocktechkno.com/how-to-integrate-bluetooth-with-ionic-3-edeea39ef3bd
* https://github.com/don/BluetoothSerial
* https://raspberrypi.stackexchange.com/questions/71149/sending-a-message-from-raspberry-pi-to-android-device-using-bluetooth

## Conclusions

* It is not possible to start live recording from a locked iPhone state by sending a Bluetooth command. The reason is that this would allow others to start recording without the user knowing. The only way to start recording is if the user presses the start recording button.
iOS is much more restrictive than android regarding to allow the app see paired Bluetooth devices.

*Building hybrid apps with Ionic 3 is very painful when the app needs access to Bluetooth, camera and GPS.
Some Bluetooth did not work on a iOS but worked on Android
Showing Google maps did work on iOS but not on Android
The GPS worked on Android but not so good on iOS
Native development might be better than hybrid for cases like this.
