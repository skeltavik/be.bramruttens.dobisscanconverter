'use strict';

const Homey = require('homey');
const WebSocket = require('ws');

class DobissDevice extends Homey.Device {

  async onInit() {
    this.log('DobissDevice has been inited');
    this.registerCapabilityListener('onoff', this.onCapabilityOnoff);

    // Set up a message listener to handle all messages from the WebSocket.
    this.homey.app.ws.on('message', this.onMessage);

    // Get the initial state of the light.
    this.getLightState();
  }

  onMessage = (data) => {
    const response = JSON.parse(data);
    const { address } = this.getData();

    // Check if the response is for this light.
    if (response.address === address) {
      // Update the state of the light in Homey.
      this.setCapabilityValue('onoff', response.state === 1);
    }
  }

  onCapabilityOnoff = async (value, opts) => {
    const { address } = this.getData();
    // Check if the WebSocket connection is open.
    if (this.homey.app.ws && this.homey.app.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ address, state: value ? 1 : 0 });
      this.homey.app.ws.send(message);
    } else {
      throw new Error('WebSocket connection is not open');
    }
  }

  async getLightState() {
    const { address } = this.getData();
    // Check if the WebSocket connection is open.
    if (this.homey.app.ws && this.homey.app.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ command: 'get_light_state', address });
      this.homey.app.ws.send(message);
    } else {
      throw new Error('WebSocket connection is not open');
    }
  }

  async onAdded() {
    this.log('DobissDevice has been added');
  }

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log('DobissDevice settings where changed');
    if (changedKeys.includes('address')) {
      const { address } = newSettings;
      this.setData({ address });
    }
  }

  async onRenamed(name) {
    this.log('DobissDevice was renamed');
  }

  async onDeleted() {
    this.log('DobissDevice has been deleted');
    this.homey.app.ws.off('message', this.onMessage);
  }

}

module.exports = DobissDevice;
