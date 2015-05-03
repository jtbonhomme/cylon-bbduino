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
    keyboard: { adaptor: 'keyboard' },
    bbduino: { adaptor: 'bbduino', port: '/dev/cu.HC-05-DevB' }
  },

  devices: {
    keyboard: { driver: 'keyboard' },
    bbduino: { driver: 'bbduino', connection: 'bbduino' }
  },

  work: function(my) {
    var servoPos = 128;

    my.keyboard.on("keydown", function(key) {
      console.log(key.name + " keydown!");
      if(key.name == 'a') {
        my.bbduino.servo((servoPos<255)?servoPos+=10:255, function() {
          console.log('[cylon-bbduino] [work] Bbduino servo pos : ' + servoPos);
        });
      }
      else if(key.name == 'z') {
        my.bbduino.servo((servoPos>0)?servoPos-=10:0, function() {
          console.log('[cylon-bbduino] [work] Bbduino servo pos : ' + servoPos);
        });
      }
      else if(key.name == 'up') {
        my.bbduino.speed(200, 200);
      }
    });

    my.keyboard.on("keyup", function(key) {
      console.log(key.name + " keyup!");
      if(key.name == 'up') {
        my.bbduino.speed(0, 0);
      }
    });

    my.bbduino.on('connect', function() {
      console.log('[cylon-bbduino] [work] connected');
    });

    my.bbduino.on('notification', function(data) {
      console.log('[cylon-bbduino] [work] notification : ' + JSON.stringify(data));
    });

    my.bbduino.on('disconnect', function() {
      bbduino.log('[cylon-bbduino] [work] disconnect');
    });

    my.bbduino.servo(servoPos, function() {
      console.log('[cylon-bbduino] [work] Bbduino servo pos : ' + servoPos);
    });
    my.bbduino.ping(function() {
      console.log('[cylon-bbduino] [work] Bbduino pinged');
    });
    // setTimeout(function(){
    //   my.bbduino.servo(5, function() {
    //     console.log('[cylon-bbduino] [work] Bbduino servo 5');
    //   });
    // }, 6500);

    // setTimeout(function(){
    //   my.bbduino.servo(250, function() {
    //     console.log('[cylon-bbduino] [work] Bbduino servo 250');
    //   });
    // }, 8500);

    // setTimeout(function(){
    //   my.bbduino.disconnect(function() {
    //     console.log('[cylon-bbduino] [work] Bbduino disconnect');
    //   });
    // }, 10000);

    // setTimeout(function(){
    //    console.log('Goodbye ...');
    //    process.exit(0);
    // }, 15000);
  }
});

Cylon.start();
