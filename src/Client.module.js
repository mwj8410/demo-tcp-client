/* global module, require */

const net = require('net');

const Log = require('../util/log');

let client;

let heartbeatTimer;

const ClientModule = {

  /**
   * Establishes a TCP connection to the configured remote system.
   * @param {string} userName The user name to be provided to the remote system for login purposes.
   */
  connect: (userName) => {
    client = net.createConnection({ host: '35.188.0.214', port: 9432 }, () => {
      Log.activity('ClientModule', 'connect', 'Connected to remote.');
    });

    client.on('data', (data) => {
      ClientModule.processData(data.toString());
    });

    client.on('end', () => {
      Log.activity('ClientModule', 'connect', 'Disconnected');
    });

    client.write(JSON.stringify({ name : userName }));
  },

  /**
   * Disconnects an already existing TCP connection.
   */
  disconnect() {
    client.destroy()
  },

  /**
   * Request the total request count from the remote system.
   */
  getCount() {
    client.write(JSON.stringify({ request : 'count' }));
  },

  /**
   * Request the current time from the remote system.
   */
  getTime() {
    client.write(JSON.stringify({ request : 'time' }));
  },

  /**
   * Parses incoming data.
   * @param {string} rawData
   */
  processData(rawData) {
    let rawPayloads = rawData.split('\n');

    rawPayloads.forEach((payload) => {
      let parsedPayload;
      if (payload.length === 0) {
        return;
      }

      try {
        parsedPayload = JSON.parse(payload);
      } catch (e) {
        Log.warning('ClientModule', 'processData', 'Payload does not appear to be well formatted JSON. Ignoring.');
        return;
      }

      switch (parsedPayload.type) {
        case 'heartbeat':
          Log.activity('ClientModule', 'processData', 'Received Heartbeat signal.');

          // Reset timer
          clearTimeout(heartbeatTimer);
          heartbeatTimer = setTimeout(() => {
            Log.activity('ClientModule', 'processData', 'Heartbeat threshold exceeded. Resetting connection!');
            ClientModule.resetConnection();
          }, 2000);
          break;
        case 'welcome':
          Log.activity('ClientModule', 'processData', 'Received Welcome message.');
          break;
        case 'msg':
          try {
            if (parsedPayload.msg.random > 30) {
              Log.info('ClientModule', 'RANDOM', 'Number is greater than 30!!!');
            }
            if (parsedPayload.msg.time) {
              Log.info('ClientModule', 'Time', `Remote reports time as ${parsedPayload.msg.time} `);
            }
            if (parsedPayload.msg.count) {
              Log.info('ClientModule', 'Count', `Remote claims to have processed ${parsedPayload.msg.count} `);
            }
          } catch (e) {}
          break;
        default:
          Log.activity('ClientModule', 'processData', 'Unknown message type received.');
          console.log(parsedPayload);
          break;
      }
    });
  },

  /**
   * Disconnects from and reconnects to the remote system.
   */
  resetConnection() {
    ClientModule.disconnect();
    // ToDo: userName would need to be retained elsewhere for this to be a usable outside of a demo
    ClientModule.connect('foo');
  }

};

module.exports = ClientModule;
