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

    my.bbduino.on('connect', function() {
      console.log('[cylon-bbduino] [work] connected');
    });

    my.bbduino.on('notification', function(data) {
      console.log('[cylon-bbduino] [work] notification : ' + JSON.stringify(data));
    });

    my.bbduino.on('message', function(data) {
      console.log('[cylon-bbduino] [work] message : ' + data);
    });

    my.bbduino.on('data', function(data) {
      console.log('[cylon-bbduino] [work] data : ' + data);
    });

    my.bbduino.on('disconnect', function() {
      bbduino.log('[cylon-bbduino] [work] disconnect');
    });

    setTimeout(function(){
      my.bbduino.ping(function() {
        console.log('[cylon-bbduino] [work] Bbduino pinged');
      });
  }, 5000);

  }
});

Cylon.start();
