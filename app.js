'use strict';

const Homey = require('homey');

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
  }

}

module.exports = DobissApp;
