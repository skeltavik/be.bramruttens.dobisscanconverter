'use strict';

const Homey = require('homey');
const WebSocket = require('ws');

class DobissDriver extends Homey.Driver {

  onInit() {
    this.log('DobissDriver has been inited');
  }

  async onPairListDevices() {
    return new Promise((resolve, reject) => {
      // Check if the WebSocket connection is open.
      if (this.homey.app.ws && this.homey.app.ws.readyState === WebSocket.OPEN) {
        // Send a message to the CAN2WS server to get the list of lights.
        this.homey.app.ws.send(JSON.stringify({ command: 'get_lights' }));

        const devices = [];

        // Set up a message listener to handle the response.
        this.homey.app.ws.on('message', (data) => {
          const response = JSON.parse(data);

          // Check if the response is a light object.
          if (response.name && response.address) {
            // Convert the light to the format expected by Homey.
            const device = {
              name: response.name,
              data: {
                id: response.address,
                address: response.address,
              },
            };
            devices.push(device);
          }
        });

        // Resolve the promise after a timeout.
        setTimeout(() => resolve(devices), 5000); // 5 seconds
      } else {
        reject(new Error('WebSocket connection is not open'));
      }
    });
  }

}

module.exports = DobissDriver;
