'use strict';

const Homey = require('homey');

class DobissDevice extends Homey.Device {

  async onInit() {
    this.log('DobissDevice has been initialized');

    // Get the MQTT client from the app instance.
    this.client = this.homey.app.client;

    // Listen for MQTT messages for this device.
    this.client.on('message', (topic, message) => {
      if (topic === `dobiss/light/${this.getData().address}/state`) {
        // Update the state of the light.
        this.setCapabilityValue('onoff', message.toString() === 'ON');
      }
    });

    // Subscribe to MQTT topic for this device.
    this.client.subscribe(`dobiss/light/${this.getData().address}/state`);

    // Set up a capability listener for the 'onoff' capability.
    this.registerCapabilityListener('onoff', this.onCapabilityOnOff.bind(this));
  }

  async onCapabilityOnOff(value, opts) {
    // This function gets called when the 'onoff' capability changes.
    // The 'value' parameter is the new state of the capability.
    // The 'opts' parameter is an object with additional options.

    // You can put your code to handle the change here. For example, you might want to send a command to your MQTT broker to change the state of the light.
    const { address } = this.getData();
    const message = value ? 'ON' : 'OFF';
    this.client.publish(`dobiss/light/${address}/state/set`, message);
  }

}

module.exports = DobissDevice;
