var discoverConnectedDevices = function(){
  var mac = undefined;
  var error = false;
  var promise = new Promise(function(resolve,reject){
    bluetoothle.initialize(function(){
      bluetoothle.retrieveConnected(function(e){
        
        resolve(e);
        error=true;
      }, function(e){reject();alert(e)})
    })
  })
  return promise;
}

var connect = function(mac){
  var myskagen = {
    "address":mac//"CC:1C:40:F0:A0:30"
  };
  var promise = new Promise(function(resolve,reject){
    evothings.ble.connectToDevice(
     myskagen,
     function(device)
     {
         console.log('Connected to device: ' + device.address);
         resolve(device)
      },
     function(device)
     {
         console.log('Disconnected from device: ' + device.address);
         reject();
     },
     function(errorCode)
     {
         console.log('Connect error: ' + errorCode);
         reject();
     }
   );
  })
  return promise;
}

var readBatteryLevel = function(skagendevice){
  var promise = new Promise(function(resolve,reject){
    evothings.ble.readCharacteristic(
      skagendevice,
      skagendevice.services[3].characteristics[0],
      function(e){

        resolve((new Int8Array(e))[0])
      },
      function(e){
        reject()
      }
    )
  })
  return promise;

}

var calculateIndicator = function(number_0_to_11, type) {
  number_0_to_11 = Math.max(number_0_to_11,0);
  number_0_to_11 = Math.min(number_0_to_11,11);
  number_0_to_11 = number_0_to_11 * 30;
  var direction = type === 'min' ? '20' : '10'

  if (number_0_to_11 > 255) {
    number_0_to_11 -= 256 
    direction = type === 'min' ? '21' : '11'
  }
  var hexString = number_0_to_11.toString(16)
  if(hexString.length==1){
    hexString = "0"+hexString;
  }
  hexString = hexString + direction
  return hexString;
}

var calculateColour = function(colour, type) {
  var degrees = 252;
  var direction = type === 'min' ? '20' : '10'
  if (colour === 'black') {
    degrees = 252;
  } else if (colour === 'green') {
    degrees = 264;
  } else if (colour === 'blue') {
    degrees = 276;
  } else if (colour === 'white') {
    degrees = 288;
  }
  if (degrees > 255) {
    degrees -= 256 
    direction = type === 'min' ? '21' : '11'
  }
  var hexString = degrees.toString(16)
  if(hexString.length==1){
    hexString = "0"+hexString;
  }
  hexString = hexString + direction
  return hexString;
}

 var signalMessage = function(skagendevice){
  var hour = 7;
  var min = 9;
  var colour = 'black';
  var pattern = '05';
  return signalMessage_advanced(skagendevice,hour,min,colour,pattern);
}

 var signalMessage_advanced = function(skagendevice, hour, min, colour, pattern){

  var initmessage_0_3 = "0207"
  var fixed_4_9 = "0f0a00"
  var vibratingpattern_10_11 = pattern || "05"
  /*
   08 = quite long
   04 = short
   05 = long
   06 = two times long
  */

  var useindicator_12_13 = "05"
  /*
   05 = yes
   everything else no
  */

  var indicatorvariaion_14_15 = "06"
  /*
   06 = use both
   05 = use only minute indicator
   01 = do not use them both
  */

  var onlyvibrate_16_17 = "10"
   /*
   b8 = unknown
   10 = unknown
  */

  var displaytime_18_19 = "27"
  /*
   2b = unknown
   27 = unknown
  */

 var minuteindicator_20_23 = calculateIndicator(min, 'min');
 var hourindicator_24_27 = calculateIndicator(hour, 'hour');
 if (colour) {
  minuteindicator_20_23 = calculateColour(colour, 'min') || minuteindicator_20_23
 }

  var toSend = initmessage_0_3
               +fixed_4_9 //seems to be a fixed value.
               +vibratingpattern_10_11
               +useindicator_12_13
               +indicatorvariaion_14_15
               +onlyvibrate_16_17
               +displaytime_18_19
               +minuteindicator_20_23
               +hourindicator_24_27;

  console.log('toSend: ' + toSend);
  // samples
  // 0123456789 01 23 45 67 89 01 23 45 67 notify pattern min hour

  // 02070f0a00 05 05 06 b8 2b f0 20 d2 10 notify 05 7 8

  // 02070f0a00 04 05 06 10 27 0e 21 0e 11 notify 04 9 9
  // 02070f0a00 02 05 06 10 27 5a 20 5a 10 notify 02 3 3

  // 02070f0a0002050610275a205a10
  // 02070f0a0005050610270e21d210  
  // 02070f0a000505061027fc20d210

  var sendarray = new Uint8Array(toSend.length/2);
  for(var i = 0;i<toSend.length;i++){
     var subeleemnt = toSend[i]+toSend[i+1];
     sendarray[i/2]=parseInt(subeleemnt.toString(16),16);
  }

  var promise = new Promise(function(resolve,reject){
    evothings.ble.writeCharacteristic(
     skagendevice,
     skagendevice.services[5].characteristics[0],
     sendarray,
     function()
     {
       resolve("sent successfully!");
     },
     function(errorCode)
     {
       reject();
       console.log('writeCharacteristic error: ' + errorCode);
     });
  })
  return promise;
}

var signalColorfields = function(){
  top = "02070f0a00040506b8 0b 3f 41 67 35"
  bottom ="02070f0a00040506b8 0b 3f 41 b9 34"

  //TODO: The different center points of the colors: white, grey, dark grey and blue lie between top and bottom
}

var setPercentage = function(percent){

  var createdivider = Math.floor(1/percent)
  var createsubstracter = Math.floor(((1/percent) % 1)* 255) + 155
  if(createsubstracter>255){
    createsubstracter-=255;
    createdivider+=1;
  }

  var initmessage_0_3 = "0211";
  "0000ff00" //-> 25%
  "0000ff01" //-> 50%
  var divider_10_11 = "01"
  var substracter_08_09 = "00"
  var toSend = initmessage_0_3+"0000ff00";

  var sendarray = new Uint8Array(toSend.length/2);
  for(var i = 0;i<toSend.length;i++){
     var subeleemnt = toSend[i]+toSend[i+1];
     sendarray[i/2]=parseInt(subeleemnt.toString(16),16);

  }
  sendarray[4]=createsubstracter;
  sendarray[5]=createdivider;
  evothings.ble.writeCharacteristic(
   myskagen,
   myskagen.services[5].characteristics[0],
   sendarray,
   function()
   {
       console.log('characteristic written');
   },
   function(errorCode)
   {
       console.log('writeCharacteristic error: ' + errorCode);
   });
}
