var bbduino = require('../lib/bbduino');
var commands = require('../lib/commands');

var dev= '/dev/cu.HC-05-DevB'; //Change this to match your device

var b = bbduino();

b.on('error', function(error) {
  console.log('[event] [error] Bbduino error:', error);
});

b.on('message', function(packet) {
  console.log('[event] [message] Bbduino packet:', packet);
});

b.on('notification', function(packet) {
  console.log('[event] [notification] Bbduino packet:', packet);
});

b.on('close', function(error) {
  console.log('[event] [close] Bbduino closed');
});

b.on('open', function() {
  console.log('[event] [open] Bbduino connected');

  setTimeout(function(){
  	b.close(function() {
  		console.log('[close_cb] Bbduino closed');
	});
  }, 5000);
});

b.open(dev, function(err) {
 	if(err) {
	   console.log('[open_cb] ' + err);
 	}
 	else {
   		console.log('[open_cb] [b.open] Bbduino connected, send a ping command');
   		b.write(commands.core.ping(false), function(err){
		 	if(err) {
			   console.log('[open_cb] [b.open] [ping] ' + err);
		 	}
		 	else {
		   		console.log('[open_cb] [b.open] [ping] sent a ping command');
			}   			
   		});
	}
});

