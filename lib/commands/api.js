
var packetBuilder = require('../packet-builder').spheroCommandPacketBuilder;
var _createPacket = require('../helpers').createPacket;

var DID = 0x02;

var createPacket = function(cid, options) {
  return _createPacket(DID, cid, options);
};

/*
 * speed goes from -255 to 255
 */
exports.speed = function(lSpeed, rSpeed, options) {
  var packet = createPacket(0x30, options);
  packet.DATA = new Buffer(4);
  packet.DATA.writeUInt8((lSpeed<0)?3:1, 0);
  packet.DATA.writeUInt8((Math.abs(lSpeed)>255)?255:Math.abs(lSpeed), 1);
  packet.DATA.writeUInt8((rSpeed<0)?3:1, 2);
  packet.DATA.writeUInt8((Math.abs(rSpeed)>255)?255:Math.abs(rSpeed), 3);
  var result = packetBuilder(packet);
  return result;
};

/*
 * pos goes from 0 to 255
 */
exports.servo = function(pos, options) {
  var packet = createPacket(0x31, options);
  packet.DATA = new Buffer(1);
  packet.DATA.writeUInt8(pos, 0);
  var result = packetBuilder(packet);
  return result;
};
