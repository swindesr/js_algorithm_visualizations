import { shuffleArray } from './random.js';

/* jQuery */
const jquery = require("jquery");
window.$ = window.jQuery = jquery;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* swap two array elements and update their states */
async function exchange(arr, i, j, algorithm) {
  algorithm.states[i] = 'being exchanged';
  algorithm.states[j] = 'being exchanged';
  await sleep(algorithm.delay);

  let swap = arr[i];
  arr[i] = arr[j];
  arr[j] = swap;
  algorithm.info.swaps++;

  algorithm.states[i] = 'being sorted';
  algorithm.states[j] = 'being sorted';
  algorithm.info.updateStats();
}

/* enable/disable input fields to prevent change during sorting */
function toggleInputs(toggle) {
  if (toggle) {
    $('input').prop('disabled', false);
    $('button').prop('disabled', false);
    $('select').prop('disabled', false);
  } else {
    $('input').prop('disabled', true);
    $('button').prop('disabled', true);
    $('select').prop('disabled', true);
  }
}

/* initialize array to be sorted and shuffles values */
function generateDefaultStateArray(size) {
  let values = new Array(size);
  let states = new Array(size);
  for (let i = 0; i < values.length; i++) {
    values[i] = i;
    states[i] = 'default';
  }
  shuffleArray(values);
  return [values, states];
}

export { sleep, exchange, toggleInputs, generateDefaultStateArray };