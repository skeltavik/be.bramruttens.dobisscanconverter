'use strict';

const Homey = require('homey');
const WebSocket = require('ws');

class DobissApp extends Homey.App {

  async onInit() {
    this.log('DobissApp is running...');

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
      // Parse the incoming data
      const message = JSON.parse(data);
      // If the message contains the list of lights, emit an event
      if (message.command === 'get_lights' && message.lights) {
        this.emit('lightsList', message.lights);
      }
    });
  }

}

module.exports = DobissApp;
