/* global after, before, require */

const Log = require('../util/log');
Log.setLevel('silent'); // Doing this first

before(() => {
  // Set global values here. These will be accessible to all tests.
});

require('../src/Example.spec');
