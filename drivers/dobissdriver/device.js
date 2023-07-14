'use strict';

const Homey = require('homey');
const WebSocket = require('ws');

class DobissDevice extends Homey.Device {

  async onInit() {
    this.log('DobissDevice has been inited');
    this.registerCapabilityListener('onoff', this.onCapabilityOnoff);

    this.homey.app.ws.on('message', this.onMessage);

    this.getLightState();
  }

  onMessage = (data) => {
    const response = JSON.parse(data);
    const { address } = this.getData();

    if (response.address === address) {
      this.setCapabilityValue('onoff', response.state === 1);
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

  async getLightState() {
    const { address } = this.getData();
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
