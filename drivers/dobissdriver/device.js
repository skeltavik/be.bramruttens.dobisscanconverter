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
