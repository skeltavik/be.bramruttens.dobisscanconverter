'use strict';

const Homey = require('homey');
const WebSocket = require('ws');

class DobissDevice extends Homey.Device {

  async onInit() {
    this.log('DobissDevice has been initialized');

    // Listen for the lightState event.
    this.homey.app.on(`lightState:${this.getData().id}`, (state) => {
      // Update the state of the light.
      this.setCapabilityValue('onoff', state === 1);
    });

    // Set up a capability listener for the 'onoff' capability.
    this.registerCapabilityListener('onoff', this.onCapabilityOnOff.bind(this));

    // Request the initial state of the light.
    this.getLightState();

    // Start polling for the state of the light every second.
    this.pollingInterval = setInterval(() => {
      this.getLightState();
    }, 1000);
  }

  async onCapabilityOnOff(value, opts) {
    // This function gets called when the 'onoff' capability changes.
    // The 'value' parameter is the new state of the capability.
    // The 'opts' parameter is an object with additional options.

    // You can put your code to handle the change here. For example, you might want to send a command to your CAN to WebSocket server to change the state of the light.
    const { address } = this.getData();
    if (this.homey.app.ws && this.homey.app.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ address, state: value ? 1 : 0 });
      this.homey.app.ws.send(message);
    } else {
      throw new Error('WebSocket connection is not open');
    }
  }

  getLightState() {
    // Send a get_all_light_states command.
    if (this.homey.app.ws && this.homey.app.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ command: 'get_all_light_states' });
      this.homey.app.ws.send(message);
    }
  }

  onDeleted() {
    // This function gets called when the device is deleted.
    // You can put your code to clean up here.

    // Stop polling for the state of the light.
    clearInterval(this.pollingInterval);
  }

}

module.exports = DobissDevice;
