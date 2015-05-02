
var packetBuilder = require('../packet-builder').spheroCommandPacketBuilder;
var _createPacket = require('../helpers').createPacket;

var DID = 0x02;

var createPacket = function(cid, options) {
  return _createPacket(DID, cid, options);
};

exports.roll = function(speed, heading, state, options) {
  var packet = createPacket(0x30, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt8(speed, 0);
  packet.DATA.writeUInt16BE(heading, 1);
  packet.DATA.writeUInt8(state, 3);
  var result = packetBuilder(packet);
  return result;
};

exports.getDeviceMode = function(options) {
  var packet = createPacket(0x44, options);
  var result = packetBuilder(packet);
  return result;
};
