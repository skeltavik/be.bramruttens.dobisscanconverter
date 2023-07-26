'use strict';

const Homey = require('homey');
const mqtt = require('mqtt');

class DobissApp extends Homey.App {

  async onInit() {
    this.log('DobissApp is running');

    const mqttUrl = this.homey.settings.get('mqttUrl');
    if (!mqttUrl) {
      this.error('MQTT server address is not set in the app settings');
      return;
    }

    this.client = mqtt.connect(mqttUrl);
    this.client.on('connect', this.onMqttConnect.bind(this));
  }

  onMqttConnect() {
    this.log('MQTT client is connected');
    // Initialize all devices now that the MQTT client is connected.
    this.drivers.forEach((driver) => driver.devices.forEach((device) => device.onInit()));
  }

}

module.exports = DobissApp;
