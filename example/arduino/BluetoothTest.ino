#include <SoftwareSerial.h> // import the serial library
#define BLUETOOTH_RX    2
#define BLUETOOTH_TX    11

SoftwareSerial SerialBluetooth( BLUETOOTH_RX, BLUETOOTH_TX);
int index = 0;
unsigned char INBYTE = 0;
char seq = 1;

#define SERIAL_BAUD     9600

char calculateChecksum(char *aBuffer, int len) {
  char ck = 0;
  int _i;
  for (_i = 0; _i < len; _i++) {
    ck += aBuffer[_i];
  }
  ck = ck & 0xFF ^ 0xFF;
  return ck;
}

void createPacket(char SOP1, char SOP2, char ID_CODE, char len, char *data, char *response) {
  char i;
  response[0] = SOP1;
  response[1] = SOP2;
  response[2] = ID_CODE;
  if(seq == 0xFF){
    seq=1;
  }
  response[3] = seq++; // seq
  response[4] = len+1; //LEN is the size of <DATA> + CHK so we need to include the header bytes
  for(i = 0 ; i < len; i++) {
    response[5 + i] = data[i];
  }
  response[5+i] = calculateChecksum(response+2, 4+len-1); // checksum
  response[6+i] = '\0'; // end of buffer
}

void setup() {
  unsigned int i;
  Serial.begin(SERIAL_BAUD);
  SerialBluetooth.begin(SERIAL_BAUD);
  delay(1000);
  Serial.println("Arduino started bluetooth communication");
}

void loop() {
  char *data = "1";
  char response[255];
  
  if (SerialBluetooth.available() > 0 ) {  // if COM port is not empty   
    INBYTE = SerialBluetooth.read();        // read next available byte
    Serial.print(INBYTE, HEX);
    Serial.print(" ");
    index++;
  }
  else if (index != 0) {
    Serial.print("(");
    Serial.print(index);
    Serial.println(")");
    createPacket(0xFF, 0xFE, 0xFD, 1, data, response);
    SerialBluetooth.print(response);
    index = 0;
  }
}
