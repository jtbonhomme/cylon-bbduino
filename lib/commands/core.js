
var packetBuilder = require('../packet-builder').spheroCommandPacketBuilder;
var _createPacket = require('../helpers').createPacket;

var DID = 0x00;

var createPacket = function(cid, options) {
  return _createPacket(DID, cid, options);
};

exports.ping = function(options) {
  var packet = createPacket(0x01, options);
  var result = packetBuilder(packet);
  return result;
};

exports.getVersion = function(options) {
  var packet = createPacket(0x02, options);
  var result = packetBuilder(packet);
  return result;
};
