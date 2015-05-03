#include <SoftwareSerial.h> // import the serial library


/*
 * MySumoBot
 *
 * Inspired from many example of arduino programs
 * 
 * author:  jtbonhomme@gmail.com
 * version: Version 1.0
 *
 * Hardware pin configuration
 * --------------------------
 * Arduino analog pin 1   : battery level
 * Arduino digital pin 2  : bluetooth HC-06 module Tx (=> arduino Rx)
 * Arduino digital pin 3  : buzzer
 * Arduino digital pin 4  : servo signal pin
 * Arduino digital pin 5  : Parallax PING))) ultrasonic sensor out
 * Arduino digital pin 7  : Right Motor Direction
 * Arduino digital pin 8  : Left Motor Direction
 * Arduino digital pin 9  : Right Motor Speed
 * Arduino digital pin 10 : Left Motor Speed
 * Arduino digital pin 11 : bluetooth HC-06 module Rx (=> arduino Tx)
 * Arduino digital pin 12 : Zumo User Push Button
 * Arduino digital pin 13 : Zumo Yellow LED
 *
 */

#define DEBUG

#define SERIAL_BAUD          9600
#define BLUETOOTH_RX         2
#define SERVO_PIN            4
#define BLUETOOTH_TX         11

#define MAX_PAYLOAD_SIZE     255
#define PACKET_HEADER_SIZE   6
#define MIN_PACKET_SIZE      7
#define RESPONSE_HEADER_SIZE 5
#define CHECKSUM_SIZE        1

#define SERVO_LEFT_POS      700
#define SERVO_CENTRAL_POS   1500
#define SERVO_RIGHT_POS     2300
#define SERVO_DELAY         750
#define MAX_SERVO_POSITION  3000

// This is the time since the last rising edge in units of 0.5us.
uint16_t volatile servoTime     = 0;
// This is the pulse width we want in units of 0.5us.
uint16_t volatile servoHighTime = 3000;
// This is true if the servo pin is currently high.
boolean volatile servoHigh      = false;

SoftwareSerial SerialBluetooth( BLUETOOTH_RX, BLUETOOTH_TX);
int index = 0;
unsigned char INBYTE = 0;

char calculateChecksum(char *aBuffer, int len) {
  char ck = 0;
  int _i;
  for (_i = 0; _i < len; _i++) {
    ck += (unsigned char)aBuffer[_i];
  }
  ck = ck & 0xFF ^ 0xFF;
  return ck;
}

int createPacket(char MRSP, char seq, char len, char *data, unsigned char *response) {
  char i;
  int rlen = 0;
  response[rlen++] = (unsigned char)0xFF;
  response[rlen++] = (unsigned char)0xFE;
  response[rlen++] = (unsigned char)MRSP;
  response[rlen++] = (unsigned char)seq; 
  response[rlen++] = (unsigned char)(len+1); //LEN is the size of <DATA> + CHK so we need to include the header bytes
  for(i = 0 ; i < len; i++) {
    response[rlen++] = (unsigned char)data[i];
  }
  response[rlen++] = calculateChecksum((char *)response+2, 4+len-1); // checksum
  response[rlen] = '\0'; // end of buffer
  return rlen;
}

void setup() {
  unsigned int i;
  Serial.begin(SERIAL_BAUD);
  SerialBluetooth.begin(SERIAL_BAUD);
  delay(1000);

  servoInit();
  servoSetPosition(MAX_SERVO_POSITION/2);
  Serial.println("Arduino started bluetooth communication");
}

int parseBuffer(char *buffer, int blen) {
  unsigned char payload[MAX_PAYLOAD_SIZE];
  char *data= "1";
  char mrsp = 1;
  unsigned char response[MAX_PAYLOAD_SIZE+RESPONSE_HEADER_SIZE+CHECKSUM_SIZE];
  int error = 0;
  unsigned char sop1 = (unsigned char)buffer[0];
  unsigned char sop2 = (unsigned char)buffer[1];
  unsigned char did  = (unsigned char)buffer[2];
  unsigned char cid  = (unsigned char)buffer[3];
  unsigned char seq  = (unsigned char)buffer[4];
  unsigned char plen = (unsigned char)buffer[5];
  unsigned char chk  = (unsigned char)buffer[5+plen];
  unsigned char cchk = calculateChecksum(buffer+2, 4+plen-1);
  int rlen = 0;
  int i;
  int value;
  
#ifdef DEBUG  
  Serial.print("parse the received buffer: ");
  Serial.println(blen);
  Serial.print(sop1, HEX);
  Serial.print(" ");
  Serial.print(sop2, HEX);
  Serial.print(" ");
  Serial.print(did, HEX);
  Serial.print(" ");
  Serial.print(cid, HEX);
  Serial.print(" ");
  Serial.print(seq, HEX);
  Serial.print(" ");
  Serial.print(plen, HEX);
  Serial.print(" ");
#endif

  for( i = 1 ; i < plen ; i++ ) {
    payload[i] = (unsigned char)buffer[5+i];
    Serial.print(payload[i], HEX);
    Serial.print(" ");
  }
  Serial.println(chk, HEX);
  
  if( blen < MIN_PACKET_SIZE ) {
    Serial.println("[ERROR] packet lenght incorrect");
    return -1;  
  }
  else if(sop1 != 0xFF || sop2 != 0xFE) {
    Serial.println("[ERROR] packet syntax (sop1 or sop2 are incorrect)");
    return -2;
  }
  else if (chk != cchk ) {
    Serial.println("[ERROR] checksum (incomming packet checksum is incorrect)");
    return -3;
  }
  else {
    switch(cid) {
      case 0x31:
        value = payload[0];
        servoSetPosition(value/255*3000);
        break;
      default:
        break;
    }
    Serial.println("[OK] send response :");
    rlen = createPacket(mrsp, seq, 1, "1", response);
    for( i = 0 ; i < 7 ; i++ ) {
      Serial.print(response[i], HEX);
      Serial.print(" ");
    }
    Serial.print("(");
    Serial.print(rlen);
    Serial.println(")");
    for( i = 0 ; i < rlen ; i++ ) {
      SerialBluetooth.write(response[i]);
    }
    return 0;
  }
 
}

void loop() {
  char buffer[MAX_PAYLOAD_SIZE+PACKET_HEADER_SIZE+CHECKSUM_SIZE];

  if (SerialBluetooth.available() > 0 ) {  // if COM port is not empty   
    INBYTE = SerialBluetooth.read();        // read next available byte
    buffer[index++] = INBYTE;
    Serial.print(INBYTE, HEX);
    Serial.print(" ");
  }
  else if (index != 0) {
    Serial.print("(");
    Serial.print(index);
    Serial.println(")");
    parseBuffer(buffer, index);
    index = 0;
  }
}


/************************************
 * SERVO DRIVER LIB
 ************************************/

// This ISR runs after Timer 2 reaches OCR2A and resets.
// In this ISR, we set OCR2A in order to schedule when the next
// interrupt will happen.
// Generally we will set OCR2A to 255 so that we have an
// interrupt every 128 us, but the first two interrupt intervals
// after the rising edge will be smaller so we can achieve
// the desired pulse width.
ISR(TIMER2_COMPA_vect)
{
  // The time that passed since the last interrupt is OCR2A + 1
  // because the timer value will equal OCR2A before going to 0.
  servoTime += OCR2A + 1;
   
  static uint16_t highTimeCopy = 3000;
  static uint8_t interruptCount = 0;
   
  if(servoHigh)
  {
    if(++interruptCount == 2)
    {
      OCR2A = 255;
    }
 
    // The servo pin is currently high.
    // Check to see if is time for a falling edge.
    // Note: We could == instead of >=.
    if(servoTime >= highTimeCopy)
    {
      // The pin has been high enough, so do a falling edge.
      digitalWrite(SERVO_PIN, LOW);
      servoHigh = false;
      interruptCount = 0;
    }
  } 
  else
  {
    // The servo pin is currently low.
     
    if(servoTime >= 40000)
    {
      // We've hit the end of the period (20 ms),
      // so do a rising edge.
      highTimeCopy = servoHighTime;
      digitalWrite(SERVO_PIN, HIGH);
      servoHigh = true;
      servoTime = 0;
      interruptCount = 0;
      OCR2A = ((highTimeCopy % 256) + 256)/2 - 1;
    }
  }
}
 
void servoInit()
{
  digitalWrite(SERVO_PIN, LOW);
  pinMode(SERVO_PIN, OUTPUT);
   
  // Turn on CTC mode.  Timer 2 will count up to OCR2A, then
  // reset to 0 and cause an interrupt.
  TCCR2A = (1 << WGM21);
  // Set a 1:8 prescaler.  This gives us 0.5us resolution.
  TCCR2B = (1 << CS21);
   
  // Put the timer in a good default state.
  TCNT2 = 0;
  OCR2A = 255;
   
  TIMSK2 |= (1 << OCIE2A);  // Enable timer compare interrupt.
  sei();   // Enable interrupts.
}
 
void servoSetPosition(uint16_t highTimeMicroseconds)
{
  TIMSK2 &= ~(1 << OCIE2A); // disable timer compare interrupt
  servoHighTime = highTimeMicroseconds * 2;
  TIMSK2 |= (1 << OCIE2A); // enable timer compare interrupt
}
