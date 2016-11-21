/**
 * Simple app to wave your robot arm
 * and randomly change your LEDs at a given interval.
 * Uses raspi-soft-pwm library built with johnny-five
 */

var raspi = require('raspi-io');
var five = require('johnny-five');
var SoftPWM = require('raspi-soft-pwm').SoftPWM;
var board = new five.Board({
  io: new raspi()
});

var ws281x = require('rpi-ws281x-native');
var NUM_LEDS = 1;        // Number of LEDs
var waveinterval = 500 ;
var lightinterval = 500 ;

// Start waving when board is ready.
board.on('ready', function() {
  var softPWM = new SoftPWM({pin: 'P1-26', range: 100, frequency: 200});
  var mincycle = 10; var maxcycle = 60 ;
 dutyCycle = mincycle;

  setInterval(function () {
    dutyCycle = dutyCycle == mincycle ? maxcycle:mincycle ;
    softPWM.write(dutyCycle);
    console.log(dutyCycle);
  }, waveinterval);
});



var colorPalette = {
    "red": 0x00ff00,
    "green": 0xff0000,
    "blue": 0x0000ff,
    "purple": 0x008080,
    "yellow": 0xc1ff35,
    "magenta": 0x00ffff,
    "orange": 0xa5ff00,
    "aqua": 0xff00ff,
    "white": 0xffffff
}


launcLED();
function launcLED(){
  setInterval(function () {
    ws281x.init(NUM_LEDS);   // initialize LEDs
    var color = new Uint32Array(NUM_LEDS);  // array that stores colors for leds

    var colors = Object.keys(colorPalette);
    var randIdx = Math.floor(Math.random() * colors.length);
    var randColor = colors[randIdx];
    //console.log(randColor)
    color[0] = colorPalette[randColor];
    ws281x.render(color);

  }, lightinterval);
}


process.on('SIGINT', function () {
    ws281x.reset();
    process.nextTick(function () { process.exit(0); });
});
