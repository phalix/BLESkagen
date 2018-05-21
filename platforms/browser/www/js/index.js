
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {


      function newDeviceSelector(){
        self = this;
        this.refreshDevices = function(){
          discoverConnectedDevices().then(e => this.devices(e));
        }
        this.selectDevice = function(e){

          connect(e.address).then(
            function(dev){
              self.selectedDevice(dev);
              self.selectedDeviceAddress(e.address);
            }
          )

        }
        this.selectedDevice = ko.observable({});
        this.selectedDeviceAddress = ko.observable("NA");
        this.devices = ko.observable([]);

      }
      var ds = new newDeviceSelector()
      ko.applyBindings(ds,document.getElementById("bluetoothselector"));

      function newBatteryDisplay(newDeviceSelector){
        this.batterylevel = ko.observable(0);
        this.fetchBatteryLevel = function(){
          if(newDeviceSelector.selectedDevice().address){
            readBatteryLevel(newDeviceSelector.selectedDevice()).then(e => this.batterylevel(e));
          }
        }
      }
      ko.applyBindings(new newBatteryDisplay(ds),document.getElementById("batteryInfo"));


      function newNotificationModel(newDeviceSelector){
        this.notify = function(){
          if(newDeviceSelector.selectedDevice().address){
            signalMessage(newDeviceSelector.selectedDevice()).then(e=>console.log(e));
          }
        }
      }
      ko.applyBindings(newNotificationModel(ds),document.getElementById("notifier"));

      function setupListening(newDeviceSelector){

        this.packages = ko.observable([]);

        this.startup = function(){
          this.packages(localStorage["packages"])
          notificationListener.listen(function(n){
           console.log("Received notification " + JSON.stringify(n) );
           localStorage["packages"][n.package] = 1;
          }, function(e){
           console.log("Notification Error " + e);
          });
        }

      }

        /*var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    }
};

app.initialize();
