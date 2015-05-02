/*
 * cylon-bbduino
 * http://cylonjs.com
 *
 */

"use strict";

var Adaptor = require("./adaptor"),
    Driver = require("./driver");

module.exports = {
  adaptors: ["bbduino"],
  drivers: ["bbduino"],

  adaptor: function(opts) {
    return new Adaptor(opts);
  },

  driver: function(opts) {
    return new Driver(opts);
  }
};