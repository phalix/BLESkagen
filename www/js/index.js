
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
  initialize: function () {
    console.log('BLESkagen deviceready')
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {

    function newDeviceSelector() {
      var self = this;

      this.refreshDevices = function () {
        discoverConnectedDevices().then(e => this.devices(e));
      }

      this.connect = function (address) {
        connect(address).then((dev) => {
          self.selectedDevice(dev);
          self.selectedDeviceAddress(address);
          localStorage.setItem("Address", address);
        }
        )
      }
      var ad = localStorage.getItem("Address");
      if (ad) {
        self.connect(ad);
      }

      this.selectDevice = function (e) {
        self.connect(e.address);
      }
      this.selectedDevice = ko.observable({});
      this.selectedDeviceAddress = ko.observable("NA");
      this.devices = ko.observable([]);

    }
    var ds = new newDeviceSelector()
    ko.applyBindings(ds, document.getElementById("bluetoothselector"));

    function newBatteryDisplay(newDeviceSelector) {
      this.batterylevel = ko.observable(0);
      this.fetchBatteryLevel = function () {
        if (newDeviceSelector.selectedDevice().address) {
          readBatteryLevel(newDeviceSelector.selectedDevice()).then(e => this.batterylevel(e));
        }
      }
    }
    ko.applyBindings(new newBatteryDisplay(ds), document.getElementById("batteryInfo"));

    function newNotificationModel(newDeviceSelector) {
      this.notify = function () {
        if (newDeviceSelector.selectedDevice().address) {
          signalMessage(newDeviceSelector.selectedDevice()).then(e => console.log(e));
        }
      }
    }

    ko.applyBindings(newNotificationModel(ds), document.getElementById("notifier"));

    function setupListening(newDeviceSelector) {
      var self = this;
      //Reset session Counter.
      sessionStorage.setItem('counter', 0);

      this.availablePatterns = ko.observable(["04", "05", "06", "07", "08"]);
      this.availableMins = ko.observable(['black', 'green', 'blue', 'white', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']);
      this.availableHours = ko.observable(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']);
      this.availableStates = ko.observable([0, 1]);

      this.packages = ko.observable([]);
      this.update = function () {
        var result = [];
        var objects = JSON.parse(localStorage.getItem("packages"));
        if (objects) {
          for (var key in objects) {
            var new_o = objects[key];
            result.push(new_o);
          }

        }
        this.packages(result);

      }

      this.changeStatePackage = function (e) {
        var objects = JSON.parse(localStorage.getItem("packages"));
        if (objects) {
          if (objects[e.key].active == 0) {
            objects[e.key].active = 1;
          } else {
            objects[e.key].active = 0;
          }
          objects[e.key].active = e.active;
          objects[e.key].min = e.min;
          objects[e.key].hour = e.hour;
          objects[e.key].pattern = e.pattern || '05';
          localStorage.setItem("packages", JSON.stringify(objects));
        }
        self.update()
      }
      this.deleteStatePackage = function (e) {
        var objects = JSON.parse(localStorage.getItem("packages"));
        if (objects) {
          if (objects[e.key]) {
            delete objects[e.key]
          } 
          localStorage.setItem("packages", JSON.stringify(objects));
        }
        self.update()
      }
      this.deleteAllPackages = function (e) {
        var objects = {}
        localStorage.setItem("packages", JSON.stringify(objects));
        self.update()
      }

      cordova.plugins.backgroundMode.setDefaults({
        "text": "Connected: " + newDeviceSelector.selectedDeviceAddress(),
        "hidden": true,
        "silent": true
      });
      cordova.plugins.backgroundMode.enable();
      cordova.plugins.notification.local.on('stop', function (notification, eopts) { 
        cordova.plugins.backgroundMode.disable();
        cordova.plugins.notification.local.clear(1, null);
        navigator.app.exitApp();
       });
      var updateStatus = function () {
        var counter = sessionStorage.getItem('counter');
        cordova.plugins.backgroundMode.configure(
          {
            "text": "Connected: " + newDeviceSelector.selectedDeviceAddress() + ", C:" + counter
          });
        cordova.plugins.notification.local.schedule({
          id: 1,
          text: "BLESkagen running C:" + counter,
          sticky: true,
          actions: [
            { id: 'stop', title: 'Stop' }
        ]
        })
      }
      updateStatus();
      newDeviceSelector.selectedDeviceAddress.subscribe(
        () => {
          updateStatus
        }
      );

      self.activeGN = ko.observable(true);
      self.busyGN = ko.observable(false);

      var restore = JSON.parse(localStorage.getItem("AllNotifications"))
      if (restore != null) {
        self.activeGN(restore);
      }

      self.changeStateGN = function () {
        self.activeGN(!self.activeGN());
        localStorage.setItem("AllNotifications", self.activeGN());
      }

      this.signalMessageByPreference = function (hour, min, pattern) {
        var colour = null
        if (isNaN(min)) {
          colour = min
        }
        hour = parseInt(hour) || 0
        min = parseInt(min) || 0

        var counter = sessionStorage.getItem('counter');
        if (!counter) {
          counter = 0
        }
        counter++;
        sessionStorage.setItem('counter', counter);
        updateStatus();
        signalMessage_advanced(
          newDeviceSelector.selectedDevice(),
          hour,
          min,
          colour,
          pattern
        ).then(e => console.log(e));
      }
      notificationListener.listen(function (n) {
        var key = n.package + ': ' + n.title;
        console.log('package ' + JSON.stringify(n));
        if (self.activeGN() == true) {
          var objects = JSON.parse(localStorage.getItem("packages"));
          if (objects && objects[key] && objects[key].active == 1) {
            if (newDeviceSelector.selectedDevice().address) {
              if (self.busyGN() == false) {
                self.busyGN(true)
                setTimeout(function(){ self.busyGN(false) }, 2000);
                self.signalMessageByPreference(
                  objects[key].hour,
                  objects[key].min,
                  objects[key].pattern,
                );
              }
            }
          }

        }
        var packages = localStorage.getItem("packages");
        if (packages == null) {
          packages = {};
        } else {
          packages = JSON.parse(packages);
        }
        
        if (!packages[key]) {
          n.key = key;
          n.active = 0;
          n.hour = '0';
          n.min = '0';
          n.pattern = "05";
          packages[key] = n;
          localStorage.setItem("packages", JSON.stringify(packages));
          console.log('packages ' + JSON.stringify(packages));
        } else {
          //Nothing to do, package already known
        }

      }, function (e) {
        console.log("Notification Error " + e);
      });

    }

    ko.applyBindings(setupListening(ds), document.getElementById("listener"));

    //  //////////////////////////////////////////////////////////////////////

    var phoneCallNotifier = function (newDeviceSelector) {
      console.log("init phoneCallNotifier");
      var self = this;

      self.availableIndicatorsPhone = ko.observable([0, 1, 2, 3, 4, 5, 6, 7, 8]);

      var indicator = localStorage.getItem("phoneIndicator");
      if (indicator != null) {
        indicator = parseInt(indicator);
      } else {
        indicator = 0;
      }
      self.indicatorPhone = ko.observable(indicator);

      var vb_restore = localStorage.getItem("VibratingPattern")
      if (vb_restore != null) {

      } else {
        vb_restore = "04";
      }
      this.vibratingPattern = ko.observable(vb_restore);

      this.setVibratingPattern04 = function () {
        var s = "04";
        localStorage.setItem("VibratingPattern", s);
        this.vibratingPattern(s);
      }

      this.setVibratingPattern05 = function () {
        var s = "05";
        localStorage.setItem("VibratingPattern", s);
        this.vibratingPattern(s);
      }
      this.setVibratingPattern06 = function () {
        var s = "06";
        localStorage.setItem("VibratingPattern", s);
        this.vibratingPattern(s);
      }
      this.setVibratingPattern07 = function () {
        var s = "07";
        localStorage.setItem("VibratingPattern", s);
        this.vibratingPattern(s);
      }

      this.setVibratingPattern08 = function () {
        var s = "08";
        localStorage.setItem("VibratingPattern", s);
        this.vibratingPattern(s);
      }

      self.active = ko.observable(false);
      var restore = JSON.parse(localStorage.getItem("PhoneCall"))
      if (restore != null) {
        self.active(restore);
      }
      self.changeState = function () {
        self.active(!self.active());
        localStorage.setItem("PhoneCall", self.active());
        localStorage.setItem("VibratingPattern", self.vibratingPattern());
        localStorage.setItem("phoneIndicator", self.indicatorPhone());
      }
      PhoneCallTrap.onCall(function (state) {
        console.log("CHANGE STATE: " + state);

        switch (state) {
          case "RINGING":
            console.log("Phone is ringing");
            if (self.active() == true) {
              if (newDeviceSelector.selectedDevice().address) {
                signalMessage_advanced(
                  newDeviceSelector.selectedDevice(),
                  self.indicatorPhone(),
                  self.indicatorPhone(),
                  null,
                  self.vibratingPattern()
                ).then(e => console.log(e));
              }
            }
            break;
          case "OFFHOOK":
            console.log("Phone is off-hook");
            break;

          case "IDLE":
            console.log("Phone is idle");
            break;
        }
      });
    }
    // ko.applyBindings(phoneCallNotifier(ds),document.getElementById("phone"));

  }
};

app.initialize();
