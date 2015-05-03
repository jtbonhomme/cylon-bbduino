var helpers = require('./helpers');

var minimumCommandPacketSize = 6; //Smallest command packets are 6 bytes long
var spheroCommandTemplate = {
  SOP1: 0,
  SOP2: 1,
  DID:  2,
  CID:  3,
  SEQ:  4,
  LEN:  5,
  DATA: 6,
  CHK:  6 //The checksum offset must be adjusted if LEN > 1
};

/**
 *
 * @param packet.DID
 * @param packet.CID
 * @param packet.SEQ
 * @param packet.DATA
 * @returns {Buffer}
 */
exports.spheroCommandPacketBuilder = function(packet) {
  packet.DID = packet.DID || 0x00;
  packet.CID = packet.CID || 0x00;
  packet.SEQ = packet.SEQ || 0x00;
  packet.DATA = packet.DATA || new Buffer(0);

  var buffer = new Buffer(packet.DATA.length + minimumCommandPacketSize);
  buffer.writeUInt8(0xff, spheroCommandTemplate.SOP1);
  buffer.writeUInt8(0xfe, spheroCommandTemplate.SOP2);
  buffer.writeUInt8(packet.DID, spheroCommandTemplate.DID);
  buffer.writeUInt8(packet.CID, spheroCommandTemplate.CID);
  buffer.writeUInt8(packet.SEQ, spheroCommandTemplate.SEQ);
  buffer.writeUInt8(packet.DATA.length+1, spheroCommandTemplate.LEN);
  packet.DATA.copy(buffer, spheroCommandTemplate.DATA);
  // todo fix the lenght error (not critical, the minimum packet lenght should not be 6 but 4 since we start checksum computation from DID)
  var checksum = helpers.calculateChecksum(buffer.slice(spheroCommandTemplate.DID, minimumCommandPacketSize + packet.DATA.length - 1));
  buffer.writeUInt8(checksum, spheroCommandTemplate.CHK + packet.DATA.length);
  return buffer;
};