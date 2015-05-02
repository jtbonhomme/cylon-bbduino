A cylon adapter for open bluetooth communication with an arduino (tested with a hc-06 module)

This library uses node-serialport (https://github.com/voodootikigod/node-serialport) to initiate communication throught bluetooth. The HC-06 module shall be paired with the host computer prior to run the program.

It uses a packet parser (lib/parser.js) based on spheron implementation of the orbix protocol (https://github.com/alchemycs/spheron/blob/master/lib/response-parser.js) 

# Example

Try example/example.js.
1. Load the bluetoothTest program (example/arduino/BluetoothTest.ino) in your arduino and open the serial monitor in the arduino IDE
2. Connect to the bluetooth device (in my case a HC-05) from your computer
3. Modify the device path to match to yours
4. Execute :
```js
node example/bbduino-example.js
node example/cylon-example.js
```

This should send a 'ping' command to your arduino and print out this on the serial monitor:
```
Arduino started bluetooth communication
FF FC 0 1 0 1 FD (7)
```

# Mac Os X

## Snow Leopard 10.7.5

Open Bluetooth prerences, select HC-O5 and configure serial port. Create a outgoing port (/dev/cu.HC-05-DevB)

# Dependencies

* node-serialport (https://github.com/voodootikigod/node-serialport)