/*
 * cylon bbduino adaptor
 * http://cylonjs.com
 *
*/

var bbduino = require('./bbduino');
var commands = require('./commands');

"use strict";

var Adaptor = module.exports = function Adaptor(opts) {
  Adaptor.__super__.constructor.apply(this, arguments);

  opts = opts || {};

  this.connector = this.bbduino = bbduino();


  if (this.port == null) {
    throw new Error(
      "No port specified for Bbduino adaptor '" + this.name + "'. Cannot proceed"
    );
  }
}

Cylon.Utils.subclass(Adaptor, Cylon.Adaptor);

/**
 * Connects to the Bbduino
 *
 * @param {Function} callback to be triggered when connected
 * @return {null}
 */
Adaptor.prototype.connect = function(callback) {
  Cylon.Logger.info("Connecting to Bbduino '" + this.name + "'...");

  this.connector.on("open", function() {
    callback();
  });

  this.defineAdaptorEvent({
    eventName: "close",
    targetEventName: "disconnect"
  });

  this.defineAdaptorEvent("error");
  this.defineAdaptorEvent("message");

  this.connector.on("notification", function(packet) {
	Cylon.Logger.info("notification from Bbduino '" + this.name + "' : " + JSON.stringify(packet));
    this.emit("notification", packet);
  }.bind(this));

  this.bbduino.open(this.port, function(err) {
    if (err) {
      this.emit("err", err);
    }
  }.bind(this));
};


/**
 * Disconnects from the Bbduino
 *
 * @param {Function} callback to be triggered when disconnected
 * @return {null}
 */
Adaptor.prototype.disconnect = function(callback) {
  Cylon.Logger.info("Disconnecting from Bbduino '" + this.name + "'...");

  this.bbduino.once("write", function() {
    this.bbduino.close(function() {
      callback();
    }.bind(this));
  }.bind(this));

  this.bbduino.speed(0,0);
};

/**
 * Stops Bbduino in place
 *
 * @return {null}
 * @publish
 */
Adaptor.prototype.stop = function() {
  this.bbduino.speed(0,0);
};
