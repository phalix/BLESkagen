cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-ble/ble.js",
        "id": "cordova-plugin-ble.BLE",
        "pluginId": "cordova-plugin-ble",
        "clobbers": [
            "evothings.ble"
        ]
    },
    {
        "file": "plugins/cordova-plugin-bluetoothle/www/bluetoothle.js",
        "id": "cordova-plugin-bluetoothle.BluetoothLe",
        "pluginId": "cordova-plugin-bluetoothle",
        "clobbers": [
            "window.bluetoothle"
        ]
    },
    {
        "file": "plugins/io.gvox.plugin.phonecalltrap/www/PhoneCallTrap.js",
        "id": "io.gvox.plugin.phonecalltrap.PhoneCallTrap",
        "pluginId": "io.gvox.plugin.phonecalltrap",
        "clobbers": [
            "window.PhoneCallTrap"
        ]
    },
    {
        "file": "plugins/cordova-plugin-broadcaster/www/broadcaster.js",
        "id": "cordova-plugin-broadcaster.broadcaster",
        "pluginId": "cordova-plugin-broadcaster",
        "clobbers": [
            "broadcaster"
        ]
    },
    {
        "file": "plugins/cordova-plugin-broadcaster/src/browser/BroadcasterProxy.js",
        "id": "cordova-plugin-broadcaster.broadcasterProxy",
        "pluginId": "cordova-plugin-broadcaster",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "pluginId": "cordova-plugin-device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/browser/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "pluginId": "cordova-plugin-device",
        "runs": true
    },
    {
        "file": "plugins/cordova-plugin-background-mode/www/background-mode.js",
        "id": "cordova-plugin-background-mode.BackgroundMode",
        "pluginId": "cordova-plugin-background-mode",
        "clobbers": [
            "cordova.plugins.backgroundMode",
            "plugin.backgroundMode"
        ]
    },
    {
        "file": "plugins/cordova-plugin-background-mode/src/browser/BackgroundModeProxy.js",
        "id": "cordova-plugin-background-mode.BackgroundMode.Proxy",
        "pluginId": "cordova-plugin-background-mode",
        "runs": true
    },
    {
        "file": "plugins/net.coconauts.notification-listener/www/notification-listener.js",
        "id": "net.coconauts.notification-listener.NotificationListener",
        "pluginId": "net.coconauts.notification-listener",
        "clobbers": [
            "notificationListener"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.3",
    "cordova-plugin-ble": "2.0.1",
    "cordova-plugin-bluetoothle": "4.4.3",
    "io.gvox.plugin.phonecalltrap": "0.1.2",
    "cordova-plugin-broadcaster": "3.1.1",
    "cordova-plugin-device": "2.0.2",
    "cordova-plugin-background-mode": "0.7.2",
    "net.coconauts.notification-listener": "0.0.2"
}
// BOTTOM OF METADATA
});