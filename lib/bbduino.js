var events = require('events');
var serialPort = require('serialport');
var responseParser = require('./parser');
var commands = require('./commands');

module.exports = function() {
  var _serialPort = null;

  var _bbduino = new events.EventEmitter();

  _bbduino.open = function(device, callback) {
    _serialPort = new serialPort.SerialPort(device, {
      parser:responseParser.spheroResponseParser()
    }, true, function(err){ 
      if (err){
        if (callback && typeof(callback) == 'function'){
          callback(err);
        }
      }});

    _serialPort.on('open', function() {
      _serialPort.on('data', function(packet) {
        _bbduino.emit('packet', packet);
        switch (packet.SOP2) {
          case 0xFF:
            _bbduino.emit('message', packet);
            break;
          case 0xFE:
            _bbduino.emit('notification', packet);
            break;
        }
      });

      _serialPort.on('close', function() {
        _bbduino.emit('close');
      });
      _serialPort.on('end', function() {
        _bbduino.emit('end');
      });
      _serialPort.on('error', function(error) {
        _bbduino.emit('error', error);
      });
      _serialPort.on('oob', function(packet) {
        _bbduino.emit('oob', packet);
      });

      _bbduino.emit('open');
      if (callback && typeof(callback) == 'function'){
        callback(null);
      }
    });
    return _bbduino;
  };
  _bbduino.close = function(callback) {
    _serialPort.close(callback);
  };
  _bbduino.write = function(buffer, callback) {
    _serialPort.write(buffer, callback);
    return _bbduino;
  };
  return _bbduino;
};