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

    this.connectToWebSocketServer(wsurl);
  }

  connectToWebSocketServer(wsurl) {
    const self = this; // Bind the outer `this` to `self`.

    self.ws = new WebSocket(wsurl);

    self.ws.on('open', () => {
      self.log('connected to CAN2WS server');
    });

    self.ws.on('close', () => {
      self.log('disconnected from CAN2WS server');
      // Reconnect after a delay.
      setTimeout(() => self.connectToWebSocketServer(wsurl), 5000);
    });

    self.ws.on('message', (data) => {
      self.log(`received: ${data}`);
      const messages = JSON.parse(data);
      if (Array.isArray(messages)) {
        messages.forEach((message) => {
          if (message.address && message.state !== undefined) {
            // Emit a lightState event for the light.
            self.emit(`lightState:${message.address}`, message.state);
          }
        });
      }
    });
  }

}

module.exports = DobissApp;
