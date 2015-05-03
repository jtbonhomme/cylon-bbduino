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

    my.bbduino.on('disconnect', function() {
      bbduino.log('[cylon-bbduino] [work] disconnect');
    });

    my.bbduino.getVersion(function(version) {
      console.log('[cylon-bbduino] [work] Bbduino version ' + version);
    });

    setTimeout(function(){
      my.bbduino.ping(function() {
        console.log('[cylon-bbduino] [work] Bbduino pinged');
      });
    }, 5000);

    setTimeout(function(){
      my.bbduino.servo(10, function() {
        console.log('[cylon-bbduino] [work] Bbduino servo 30');
      });
    }, 6500);

    setTimeout(function(){
      my.bbduino.servo(250, function() {
        console.log('[cylon-bbduino] [work] Bbduino servo 250');
      });
    }, 8500);

    setTimeout(function(){
      my.bbduino.disconnect(function() {
        console.log('[cylon-bbduino] [work] Bbduino disconnect');
      });
    }, 10000);

    setTimeout(function(){
       console.log('Goodbye ...');
       process.exit(0);
    }, 15000);
  }
});

Cylon.start();
