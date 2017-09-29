/* global process, require */

const Log = require('../util/log');

/* ***** ***** ***** ***** ***** ***** ***** ***** ***** *****
 * Any required application logic used in non-unit testing
 * ***** ***** ***** ***** ***** ***** ***** ***** ***** *****/

const net = require('net');

const ClientModule = require('./Client.module');
const UI = require('./UI.module');

const inputActions = [
  {
    key: 'c',
    description: 'Get total request count.',
    handler: () => {
      ClientModule.getCount();
    }
  },
  {
    key: 't',
    description: 'Get current time.',
    handler: () => {
      ClientModule.getTime();
    }
  },
  {
    key: 'a',
    description: 'Display all activity logs.',
    handler: () => {
      Log.setLevel('all');
    }
  },
  {
    key: 'l',
    description: 'Limit activity logs in info an below',
    handler: () => {
      Log.setLevel('info');
    }
  },
  {
    key: 'r',
    description: 'Redraw Screen',
    handler: () => {
      UI.draw();
    }
  },

  {
    key: 'x',
    description: 'Exit',
    handler: () => {
      Log.activity('UI', 'user action', 'Exiting.');
      process.exit();
    }
  }
];

Log.setLevel('info');
ClientModule.connect('foo');
UI.initialize(inputActions);
