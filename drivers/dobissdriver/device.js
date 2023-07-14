'use strict';

const Homey = require('homey');
const WebSocket = require('ws');

class DobissDevice extends Homey.Device {

  async onInit() {
    this.log('DobissDevice has been inited');
    this.registerCapabilityListener('onoff', this.onCapabilityOnoff);

    this.homey.app.ws.on('message', this.onMessage);

    // Listen for the allLightStates event.
    this.homey.app.on('allLightStates', this.onAllLightStates);
    this.log('Added onAllLightStates event listener'); // Add this log
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

  onAllLightStates = (lights) => {
    this.log('onAllLightStates called'); // Add this log

    const { address } = this.getData();

    // Find the light data for this device.
    const light = lights.find((light) => light.address === address);

    if (light) {
      // Update the state of the light in Homey.
      this.log('Updating state for light:', light);
      this.setCapabilityValue('onoff', light.state === 1);
    } else {
      this.log('No light data found for this device');
    }
  }

  onCapabilityOnoff = async (value, opts) => {
    const { address } = this.getData();
    if (this.homey.app.ws && this.homey.app.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ address, state: value ? 1 : 0 });
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

    // Remove the listener for the allLightStates event.
    this.homey.app.off('allLightStates', this.onAllLightStates);
  }

}

module.exports = DobissDevice;
