/*
 * cylon bbduino adaptor
 * http://cylonjs.com
 *
*/

"use strict";

var Cylon = require('cylon');
var bbduino = require('./bbduino');
var commands = require('./commands');

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


/**
 * Ping the Bbduino
 *
 * @param {Function} callback to be triggered when connected
 * @return {null}
 */
Adaptor.prototype.ping = function(callback) {
  Cylon.Logger.info("Ping the Bbduino '" + this.name + "'...");

  this.bbduino.write(commands.core.ping(false), function(err){
    if(err) {
	  console.log('[open_cb] [b.open] [ping] ' + err);
	  this.emit("err", err);
	}
	else {
  	  console.log('[open_cb] [b.open] [ping] sent a ping command');
	}   			
  }.bind(this));
};

