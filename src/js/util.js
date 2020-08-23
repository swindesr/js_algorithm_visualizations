import { shuffleArray } from './random.js';

/**
 * Halts execution for a set duration.
 * @param {number} ms - Number of milliseconds to sleep
 * @returns {Promise} Promise object to be resolved after delay
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Swaps two array elements and update their states accordingly.
 * @param {number[]} arr - Array containing elements to be swapped
 * @param {number} i - First element index
 * @param {number} j - Second element index
 * @param {SortingAlgorithm} algorithm - SortingAlgorithm object containing states and info to be updated
 * @returns void
 */
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

/**
 * Enables/disables input fields
 * @param {boolean} toggle - True to enable fields, false to disable fields
 * @returns void
 */
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

/**
 * Initializes array of values and states, and shuffles values.
 * @param {number} size - Size of arrays to be created
 * @return {Array<number[], string[]>} A tuple containing the value and state arrays
 */
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