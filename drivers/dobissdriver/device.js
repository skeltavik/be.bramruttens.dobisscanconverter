'use strict';

const Homey = require('homey');

class DobissDevice extends Homey.Device {

  async onInit() {
    this.log('DobissDevice has been initialized');

    // Get the MQTT client from the app instance.
    this.client = this.homey.app.client;

    // Check if the MQTT client is available.
    if (!this.client) {
      this.log('MQTT client is not available');
      return;
    }

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
    // This method is called when the 'onoff' capability is changed.
    // 'value' is the new value of the 'onoff' capability (true for on, false for off).
    // 'opts' is an optional object with additional information.

    // Publish an MQTT message to change the state of the light.
    this.client.publish(`dobiss/light/${this.getData().address}/state/set`, value ? 'ON' : 'OFF');
  }

}

module.exports = DobissDevice;
