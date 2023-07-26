'use strict';

const Homey = require('homey');
const mqtt = require('mqtt');

class DobissApp extends Homey.App {

  onInit() {
    this.log('DobissApp is running...');
    const mqttUrl = this.homey.settings.get('mqttUrl');
    this.client = mqtt.connect(mqttUrl);

    // Increase the maximum number of listeners.
    // Replace 20 with the maximum number of devices you expect to have.
    this.client.setMaxListeners(20);
  }

}

module.exports = DobissApp;
