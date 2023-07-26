'use strict';

const Homey = require('homey');
const mqtt = require('mqtt');
const fetch = require('node-fetch');

class DobissDriver extends Homey.Driver {

  onInit() {
    this.log('DobissDriver has been inited');
    const mqttUrl = this.homey.settings.get('mqttUrl');
    this.client = mqtt.connect(mqttUrl);
  }

  async onPairListDevices() {
    // Fetch the configuration from the Raspberry Pi.
    const response = await fetch('http://192.168.1.108:8000/config.yaml');
    const config = await response.json();

    // Convert the configuration to the format expected by Homey.
    const devices = config.map((light) => ({
      name: light.name,
      data: {
        id: light.address,
        address: light.address,
      },
    }));

    return devices;
  }

}

module.exports = DobissDriver;
