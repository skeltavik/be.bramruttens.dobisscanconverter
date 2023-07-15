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

      // Send a get_all_light_states command every 2 seconds.
      this.intervalId = setInterval(() => {
        this.ws.send(JSON.stringify({ command: 'get_all_light_states' }));
      }, 2000);
    });

    this.ws.on('close', () => {
      this.log('disconnected from CAN2WS server');

      // Clear the interval when the WebSocket connection is closed.
      clearInterval(this.intervalId);
    });

    this.ws.on('message', (data) => {
      this.log(`received: ${data}`);
      const message = JSON.parse(data);
      if (Array.isArray(message)) {
        // Emit an event for each light state.
        for (const lightState of message) {
          this.emit(`lightState:${lightState.address}`, lightState.state);
        }
      } else if (message.command === 'get_lights' && message.lights) {
        this.emit('lightsList', message.lights);
      }
    });
  }

}

module.exports = DobissApp;
