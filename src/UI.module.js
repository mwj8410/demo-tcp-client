/* global module, require */

const Log = require('../util/log');

require('colors');

const components = {
  commandLine: (key, description) => ` ${('(').blue}${(key).green}${(')').blue} ${(description).cyan}\n`,

  hr: () => `${('==============================').cyan}\n`,

  h1: (title) => `${(`==========   ${title}   ==========`).cyan}\n`
};

let inputActions = [];

const UIModule = {

  /**
   * Configures the STDIN user input based on the actions in `inputActions`
   */
  configureInput: () => {
    const stdin = process.stdin;
    stdin.setEncoding( 'utf8' );
    stdin.setRawMode( true ); // we want single key strokes

    // resume stdin in the parent process (node app won't quit all by itself
    // unless an error or process.exit() happens)
    stdin.resume();

    stdin.on( 'data', (key) => {
      const action = inputActions.filter(action => action.key === key);
      if (action[0]) {
        action[0].handler();
      }
    });
  },

  /**
   * Redraws the screen with menu.
   */
  draw: () => {
    process.stdout.write('\033c');
    process.stdout.write('\n\n\n');
    process.stdout.write(components.h1('Menu'));
    process.stdout.write(components.hr());

    inputActions.forEach(action => {
      process.stdout.write(components.commandLine(action.key, action.description));
    });

    process.stdout.write('\n\n\n');
    process.stdout.write('\n\n\n');
  },

  initialize: (providedInputActions) => {
    inputActions = providedInputActions;
    UIModule.draw();
    UIModule.configureInput();
  }

};

module.exports = UIModule;
