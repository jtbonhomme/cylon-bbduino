
var packetBuilder = require('../packet-builder').spheroCommandPacketBuilder;
var _createPacket = require('../helpers').createPacket;

var DID = 0x02;

var createPacket = function(cid, options) {
  return _createPacket(DID, cid, options);
};

exports.speed = function(lSpeed, rSpeed, options) {
  var packet = createPacket(0x30, options);
  packet.DATA = new Buffer(2);
  packet.DATA.writeUInt8(lSpeed, 0);
  packet.DATA.writeUInt8(rSpeed, 1);
  var result = packetBuilder(packet);
  return result;
};
