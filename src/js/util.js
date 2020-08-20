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

export { sleep, exchange, toggleInputs };