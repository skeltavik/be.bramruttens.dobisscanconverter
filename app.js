'use strict';

const Homey = require('homey');
const mqtt = require('mqtt');

class DobissApp extends Homey.App {

  async onInit() {
    this.log('DobissApp is running');

    const mqttUrl = this.homey.settings.get('mqttUrl');
    if (!mqttUrl) {
      this.error('MQTT server address is not set in the app settings');
      return;
    }

    this.connectToMqttServer(mqttUrl);
  }

  connectToMqttServer(mqttUrl) {
    const self = this;

    self.mqttClient = mqtt.connect(mqttUrl);

    self.mqttClient.on('connect', () => {
      self.log('connected to MQTT server');
      // Subscribe to all light state topics
      self.mqttClient.subscribe('dobiss/light/+/state');
    });

    self.mqttClient.on('disconnect', () => {
      self.log('disconnected from MQTT server');
      // Reconnect after a delay.
      setTimeout(() => self.connectToMqttServer(mqttUrl), 5000);
    });

    self.mqttClient.on('message', (topic, message) => {
      self.log(`received: ${topic} ${message}`);
      const address = topic.split('/')[2];
      const state = message.toString();
      // Emit a lightState event for the light.
      self.emit(`lightState:${address}`, state);
    });
  }

}

module.exports = DobissApp;
