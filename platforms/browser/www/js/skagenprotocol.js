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
         console.log('Connected to device: ' + device.name);
         resolve(device)
      },
     function(device)
     {
         console.log('Disconnected from device: ' + device.name);
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

var calculateIndicator = function(number_0_to_11){
  number_0_to_11 = Math.max(number_0_to_11,0);
  number_0_to_11 = Math.min(number_0_to_11,11);
  number_0_to_11 = number_0_to_11 * 30;
  hexString = number_0_to_11.toString(16);
  if(hexString.length==1){
    hexString = "0"+hexString;
  }
  return hexString;


}

var signalMessage = function(skagendevice){
  var vibratingpattern_10_11 = "04"
  /*
   08 = quite long
   04 = short
   05 = long
   06 = two times long
  */
  var hourindicator_24_25 = "1e"
  var minuteindicator_20_21 = "1e"
   /*
   1e = 1
   3c = 2
   4b = 2,5
   5a = 3
   */
  return signalMessage_advanced(skagendevice,vibratingpattern_10_11,hourindicator_24_25,minuteindicator_20_21);
}

 var signalMessage_advanced = function(skagendevice,vibratingpattern_10_11,hourindicator_24_25,minuteindicator_20_21){


   var initmessage_0_3 = "0207"

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
   var onlyvibrate_16_17 = "b8"
   var displaytime_18_19 = "2b"

   var toSend = initmessage_0_3
                +"0f0a00" //seems to be a fixed value.
                +vibratingpattern_10_11
                +useindicator_12_13
                +indicatorvariaion_14_15
                +onlyvibrate_16_17
                +displaytime_18_19
                +minuteindicator_20_21
                +"20"
                +hourindicator_24_25
                +"10";

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
        resolve(true);
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
  top = "02070f0a00040506b80b3f416735"
  bottom ="02070f0a00040506b80b3f41b934"

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
