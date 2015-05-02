/*
  * cylon bbduino driver
  * http://cylonjs.com
  *
*/

"use strict";

var Cylon = require("cylon");

var Driver = module.exports = function Driver() {
  Driver.__super__.constructor.apply(this, arguments);
}

Cylon.Utils.subclass(Driver, Cylon.Driver);

/**
 * Starts the driver.
 *
 * @param {Function} callback to be triggered when started
 * @return {null}
 */
Driver.prototype.start = function(callback) {
  var events = ["notification"];

  events.forEach(function(e) {
    this.defineDriverEvent(e);
  }.bind(this));

  callback();
};

/**
 * Stops the driver.
 *
 * @param {Function} callback to be triggered when halted
 * @return {null}
 */
Driver.prototype.halt = function(callback) {
  callback();
};

/**
 * Tells Bbduino to roll at a specific speed.
 *
 * @param {Number} lSpeed
 * @param {Number} rSpeed
 * @return {null}
 * @publish
 */
Driver.prototype.speed = function(lSpeed, rSpeed) {
  this.connection.speed(lSpeed, rSpeed);
};

/**
 * Tells Bbduino to stop in place.
 *
 * @return {null}
 * @publish
 */
Driver.prototype.stop = function() {
  this.connection.stop();
};


/**
 * Pings the Bbduino
 *
 * @return {null}
 * @publish
 */
Driver.prototype.ping = function(callback) {
  this.connection.ping(callback); // call the adaptor's api (why ?)
};

/**
 * getVersion the Bbduino
 *
 * @return {null}
 * @publish
 */
Driver.prototype.getVersion = function(callback) {
  this.connection.getVersion(callback); // call the adaptor's api (why ?)
};
