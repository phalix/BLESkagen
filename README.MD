# BLE Protocol for Skagen Smartwatch

This app enables you to define more customized notifications for your Skagen Hybrid Smartwatch.
Could be that it also works for Fossil Q, Misfit and other Hybrid Smartwatches.
Specifically you can select particular vibrating patterns and you are not restricted to a maximum number of notification apps. Also in addition of using the indicators for the time, you can also use the indicator for the different colors.

## Getting Started

### Software used
You need to have node.js, cordova and android studio installed to run the project on an android device. On iOS or any other OS this project was never tested. The Bluetooth Functionality will not work in the Browser.

### Start the Project

This Project heavily depends on cordova and some plugins.
Download the project and start it with
```
npm install
cordova platform add android
cordova run android
```
ios or other os were never tested.

![App Screenshot](https://user-images.githubusercontent.com/2444534/42414681-86897ba0-823a-11e8-97e2-15a8cecce4d8.jpg)


## Plugins used
* cordova-plugin-background-mode 0.7.2 "BackgroundMode"
* cordova-plugin-ble 2.0.1 "Evothings BLE API"
* cordova-plugin-bluetoothle 4.4.3 "Bluetooth LE"
* cordova-plugin-broadcaster 3.1.1 "broadcaster"
* cordova-plugin-device 2.0.2 "Device"
* cordova-plugin-whitelist 1.3.3 "Whitelist"
* io.gvox.plugin.phonecalltrap 0.1.2 "PhoneCallTrap"
* net.coconauts.notification-listener 0.0.2 "Notification-listener"
* cordova-plugin-local-notification 0.9.0-beta.2 "LocalNotification"

## TODO
Interesting things to investigate would be to
* permanently move the indicator with the percentage/color-clock-face. This would be an interesting scenario to avoid using the vibration or to have a back scenario if the vibration was not realised by the user.
* Additionally the usage of the clock buttons for e.g. IFTTT.
* Integration with GADGETBRIDGE to use a more sophisticated plattform.
* Investigate even more the bluetooth protocol to find functions not yet known.
* Snychronize the Alarm with the Standard Application in Android & iOS
