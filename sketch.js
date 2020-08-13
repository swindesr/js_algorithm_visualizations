import { shuffleArray } from './js/random.js';
import { SortingProgram } from './js/algorithms/sortingProgram.js';
import { QuickSort } from './js/algorithms/quickSort.js';
import { BubbleSort } from './js/algorithms/bubbleSort.js';
import { SelectionSort } from './js/algorithms/selectionSort.js';
import { InsertionSort } from './js/algorithms/insertionSort.js';
import { ShellSort } from './js/algorithms/shellSort.js';
import { MergeSort } from './js/algorithms/mergeSort.js';

/* sizing values */
const WIDTH = $('#p5js').width();
const HEIGHT = $('#p5js').height();
const BAR_FLOOR = HEIGHT;
let barWidth;

/* color values */
const BG_COLOR = 0;
const BAR_COLOR = 170;

/* array to be sorted */
let values = [];
let states = [];

/* sliders */
let itemCountSlider = $('#itemCountSlider');
let delaySlider = $('#delaySlider');

/* algorithm managment */
let sortingProgram = new SortingProgram(values, states, delaySlider.attr('value'));;
let sortingAlgorithm = new QuickSort();

window.setup = () => {
  let renderer = createCanvas(WIDTH, HEIGHT);
  renderer.parent('p5js');

  sortingAlgorithm.updateInfoFields();
  setupSliders();
  setupArray();
  setBarWidth();
  toggleInputs(true);
}

window.draw = () => {
  background(BG_COLOR);
  for (let i = 0; i < values.length; i++) {
    drawBarWithState(i);
  }
}

function drawBarWithState(i) {
  if (states[i] == 'default') {
    fill(BAR_COLOR);
  } else if (states[i] == 'partition') {
    fill(255,50,50);
  } else if (states[i] == 'being exchanged') {
    fill(75,255,75);
  } else if (states[i] == 'being sorted') {
    fill(255);
  }
  rect(i * barWidth, BAR_FLOOR - values[i] - 2, barWidth, values[i] + 2);
}

function setupSliders() {
  $('#alg-items').text(itemCountSlider.attr('value'));
  $('#alg-delay').text(delaySlider.attr('value'));
}

function setupArray() {
  values = new Array(parseInt(itemCountSlider.attr('value')));
  for (let i = 0; i < values.length; i++) {
    values[i] = i;
    states[i] = 'default';
  }
  shuffleArray(values);
}

function setBarWidth() {
  barWidth = WIDTH / itemCountSlider.attr('value');
}

$("#run").click(async function() {
  toggleInputs(false);
  await sort();
  toggleInputs(true);
});

$("#shuffle-items").click(function() {
  shuffleArray(values);
});

async function sort() {
  sortingProgram = new SortingProgram(values, states, delaySlider.attr('value'));
  await sortingProgram.runSort(sortingAlgorithm);
  console.log("Finished Sort.");
}

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

$('#itemCountSlider').on('input', function() {
  $("#slide-itemCount").text(this.value);
  $("#alg-items").text(this.value);
  this.setAttribute('value', this.value);
  setupArray();
  setBarWidth();
});

$('#delaySlider').on('input', function() {
  $("#slide-delay").text(this.value);
  $("#alg-delay").text(this.value);
  this.setAttribute('value', this.value);
});

$('#alg-select').on('change', function() {
  switch(this.value) {
    case 'quick':
      sortingAlgorithm = new QuickSort();
      break;
    case 'merge':
        sortingAlgorithm = new MergeSort();
        break;
    case 'bubble':
      sortingAlgorithm = new BubbleSort();
      break;
    case 'selection':
      sortingAlgorithm = new SelectionSort();
      break;
    case 'insertion':
      sortingAlgorithm = new InsertionSort();
      break;
    case 'shell':
      sortingAlgorithm = new ShellSort();
      break;
    default: break;
  }
  sortingAlgorithm.updateInfoFields();
});