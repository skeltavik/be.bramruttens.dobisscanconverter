<img src=https://homey.app/img/pages/home/homey.webp>

# Dobiss CAN2MQTT Converter App for Homey

This repository contains the code for the Dobiss CAN2MQTT Converter App for Homey. This application allows you to control your Dobiss lights using the Homey smart home platform. It works in conjunction with the [dobiss-can2mqtt](https://github.com/skeltavik/dobiss-can2mqtt) which should be running first.

## Features

- Connects to an MQTT broker to send and receive messages.
- Listens for MQTT messages for each device and updates the state of the device in Homey accordingly.
- Publishes MQTT messages to change the state of a device when the device's state is changed in Homey.
- Fetches device configuration from a YAML file and adds the devices to Homey during pairing.

## How to Use

1. Ensure [dobiss-can2mqtt](https://github.com/skeltavik/dobiss-can2mqtt) is running.
2. Clone this repository.
3. Run the application using `homey app install`.
4. Once the app is installed on the Homey, set the MQTT broker URL and the URL of the YAML configuration file in the Homey settings.

## Files

- `app.js`: This is the main application file. It connects to the MQTT broker and sets up the MQTT client.
- `drivers/dobissdriver/device.js`: This file defines the DobissDevice class. Each instance of this class represents a Dobiss light in Homey. The class listens for MQTT messages for its device and updates the device's state in Homey. It also publishes MQTT messages to change the state of the device when the device's state is changed in Homey.
- `drivers/dobissdriver/driver.js`: This file defines the DobissDriver class. This class fetches the device configuration from a YAML file and adds the devices to Homey during pairing.

## Dependencies

- `homey`: This is the Homey library. It provides the classes and methods needed to interact with the Homey platform.
- `mqtt`: This library is used to connect to the MQTT broker and send and receive MQTT messages.
- `axios`: This library is used to fetch the YAML configuration file.
- `js-yaml`: This library is used to parse the YAML configuration file.

## Contributing

Please see the `CONTRIBUTING.md` file for guidelines on contributing to this project.

## License

This project is licensed under the terms of the license found in the `LICENSE` file.

## Code of Conduct

Please see the `CODE_OF_CONDUCT.md` file for our code of conduct.

## Contact

If you have any questions or issues, please open an issue on this repository.
