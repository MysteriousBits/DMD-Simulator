const dispdataUrl = '/get/dispdata';
const postUrl = '/post/dispdata';
const delayUrl = '/set/delay';
const stepUrl = '/set/step';
const randomUrl = '/set/random';
const scrollUrl = '/set/scroll';

const minDelay = 20, maxDelay = 500;
const maxSpeedValue = 100;
const maxFileSize = 1024;

let speed = 50, step = 1;
let start = 0;
let intervalId;
let byteArray;