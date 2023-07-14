'use strict';

const Homey = require('homey');
const WebSocket = require('ws');

class DobissApp extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('DobissApp has been initialized');
    const wsurl = this.homey.settings.get('wsurl');
    if (!wsurl) {
      this.error('WebSocket server address is not set in the app settings');
    }
    this.ws = new WebSocket(wsurl);

    this.ws.on('open', function open() {
      this.log('connected to CAN2WS server');
    });

    this.ws.on('close', function close() {
      this.log('disconnected from CAN2WS server');
    });

    this.ws.on('message', function incoming(data) {
      console.log(`received: ${data}`);
      // Parse the incoming data
      const message = JSON.parse(data);
      // If the message contains the list of lights, emit an event
      if (message.command === 'get_lights' && message.lights) {
        this.emit('lightsList', message.lights);
      }
    }.bind(this));
  }

}

module.exports = DobissApp;
