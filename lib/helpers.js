/**
 * Calculate the checksum of a buffer by summing the bytes with module 256 then 1-complimenting the result
 *
 * @param aBuffer
 * @returns {number}
 */
exports.calculateChecksum = function(aBuffer) {
  var calculatedChecksum = 0;
  for (var _i = 0; _i < aBuffer.length; _i++) {
    calculatedChecksum += aBuffer.readUInt8(_i);
  }
  calculatedChecksum = calculatedChecksum & 0xFF ^ 0xFF;
  return calculatedChecksum;
};

/**
 * Internal helper class create a Sphero command packet
 *
 * @param did
 * @param cid
 * @param options
 * @returns {{}}
 */
exports.createPacket = function(did, cid, options) {
  var _packet = {};
  for (var _i in options) {
    if (options.hasOwnProperty(_i)) {
      _packet[_i] = options[_i];
    }
  }
  _packet.DID = did;
  _packet.CID = cid;

  return _packet;
};