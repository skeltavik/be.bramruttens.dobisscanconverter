'use strict';

const Homey = require('homey');
const mqtt = require('mqtt');
const axios = require('axios');
const yaml = require('js-yaml');

class DobissDriver extends Homey.Driver {

  onInit() {
    this.log('DobissDriver has been inited');
    const mqttUrl = this.homey.settings.get('mqttUrl');
    this.client = mqtt.connect(mqttUrl);
  }

  async onPairListDevices() {
    // Fetch the yaml configuration
    const yamlUrl = this.homey.settings.get('yamlUrl');
    const response = await axios.get(yamlUrl);
    const config = yaml.load(response.data);

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
