'use strict';

const { Driver } = require('homey');

class DobissDriver extends Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('DobissDriver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device
   * and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    return new Promise((resolve, reject) => {
      // Send a message to the CAN2WS server to get the list of lights.
      this.homey.app.ws.send(JSON.stringify({ command: 'get_lights' }));

      // Set up a message listener to handle the response.
      this.homey.app.ws.on('message', function incoming(data) {
        const response = JSON.parse(data);

        // Check if the response contains the list of lights.
        if (response.command === 'get_lights' && response.lights) {
          // Convert the list of lights to the format expected by Homey.
          const devices = response.lights.map(light => ({
            name: light.name,
            data: {
              id: light.id,
              address: light.address,
            },
          }));

          resolve(devices);
        } else {
          reject(new Error('Failed to get the list of lights'));
        }
      });
    });
  }

}

module.exports = DobissDriver;
