cordova.define("io.gvox.plugin.phonecalltrap.PhoneCallTrap", function(require, exports, module) { var PhoneCallTrap = {
    onCall: function(successCallback, errorCallback) {
        errorCallback = errorCallback || this.errorCallback;
        cordova.exec(successCallback, errorCallback, 'PhoneCallTrap', 'onCall', []);
    },

    errorCallback: function() {
        console.log("WARNING: PhoneCallTrap errorCallback not implemented");
    }
};

module.exports = PhoneCallTrap;

});
