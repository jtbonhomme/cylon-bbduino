/*
 * cylon-bbduino
 * http://cylonjs.com
 *
 */

"use strict";

var Cylon = require('cylon');

Cylon.robot({
  name: "MyBbduino",

  connections: {
    bbduino: { adaptor: 'bbduino', port: '/dev/cu.HC-05-DevB' }
  },

  devices: {
    bbduino: { driver: 'bbduino', connection: 'bbduino' }
  },

  work: function(my) {
  }
});

Cylon.start();
