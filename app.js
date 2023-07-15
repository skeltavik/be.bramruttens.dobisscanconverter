'use strict';

const Homey = require('homey');
const WebSocket = require('ws');

class DobissApp extends Homey.App {

  async onInit() {
    this.log('DobissApp is running');

    const wsurl = this.homey.settings.get('wsurl');
    if (!wsurl) {
      this.error('WebSocket server address is not set in the app settings');
      return;
    }

    this.ws = new WebSocket(wsurl);

    this.ws.on('open', () => {
      this.log('connected to CAN2WS server');
    });

    this.ws.on('close', () => {
      this.log('disconnected from CAN2WS server');
    });

    this.ws.on('message', (data) => {
      this.log(`received: ${data}`);
      const messages = JSON.parse(data);
      if (Array.isArray(messages)) {
        messages.forEach((message) => {
          if (message.address && message.state !== undefined) {
            // Emit a lightState event for the light.
            this.emit(`lightState:${message.address}`, message.state);
          }
        });
      }
    });
  }

}

module.exports = DobissApp;
