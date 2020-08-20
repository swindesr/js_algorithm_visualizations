/* script imports */
import P5 from 'p5';
import { shuffleArray } from './js/random.js';
import { SortingProgram } from './js/algorithms/sortingProgram.js';
import { QuickSort } from './js/algorithms/quickSort.js';
import { BubbleSort } from './js/algorithms/bubbleSort.js';
import { SelectionSort } from './js/algorithms/selectionSort.js';
import { InsertionSort } from './js/algorithms/insertionSort.js';
import { ShellSort } from './js/algorithms/shellSort.js';
import { MergeSort } from './js/algorithms/mergeSort.js';

/* style imports */
import 'bootstrap/dist/css/bootstrap.css';
import './styles/styles.css';

/* jQuery */
const jquery = require("jquery");
window.$ = window.jQuery = jquery;

/* sizing values */
let width = $('#p5js').width();
let height = $('#p5js').height();

let barWidth; // dependent on number of bars

/* color values */
const BG_COLOR = [0,0,0];
const DEFAULT_BAR_COLOR = [170,170,170];
const BEING_SORTED_BAR_COLOR = [255,255,255];
const BEING_EXCHANGED_BAR_COLOR = [75,255,75];
const PARTITION_BAR_COLOR = [255,50,50]

/* array to be sorted */
let values = [];
let states = [];

/* sliders */
const itemCountSlider = $('#itemCountSlider');
const delaySlider = $('#delaySlider');

/* algorithm managment */
let sortingProgram = new SortingProgram(values, states, delaySlider.attr('value'));
let sortingAlgorithm = new QuickSort();

const p5sketch = (p) => {
  /* called once when program starts to initialize p5js environment */
  p.setup = () => {
    let renderer = p.createCanvas(width, height);
    renderer.parent('p5js');

    updateSliderInfoFields();
    setupArray();
    setBarWidth();
    toggleInputs(true);
  }

  /* called continuously to render visuals to parent container */
  p.draw = () => {
    p.background(BG_COLOR);
    for (let i = 0; i < values.length; i++) {
      drawBarWithState(i);
    }
  }

  /* render single bar to correct screen location with correct color */
  const drawBarWithState = (i) => {
    if (states[i] == 'default') {
      p.fill(DEFAULT_BAR_COLOR);
    } else if (states[i] == 'partition') {
      p.fill(PARTITION_BAR_COLOR);
    } else if (states[i] == 'being exchanged') {
      p.fill(BEING_EXCHANGED_BAR_COLOR);
    } else if (states[i] == 'being sorted') {
      p.fill(BEING_SORTED_BAR_COLOR);
    }
    p.rect(i * barWidth, p.height - values[i] - 2, barWidth, values[i] + 2);
  }

  p.windowResized = () => {
    width = $('#p5js').width();
    height = $('#p5js').height();
    p.resizeCanvas(width, height);
    setBarWidth();
  }
}

/* instance mode for p5js */
new P5(p5sketch, 'p5js')

/* render slider values to appropriate text fields */
function updateSliderInfoFields() {
  $('#alg-items').text(itemCountSlider.attr('value'));
  $('#alg-delay').text(delaySlider.attr('value'));
}

/* initialize array to be sorted and shuffles values */
function setupArray() {
  values = new Array(parseInt(itemCountSlider.attr('value')));
  for (let i = 0; i < values.length; i++) {
    values[i] = i;
    states[i] = 'default';
  }
  shuffleArray(values);
}

function setBarWidth() {
  barWidth = width / itemCountSlider.attr('value');
}

$("#run").click(async function() {
  toggleInputs(false);
  await sort();
  toggleInputs(true);
});

/* sort values based on currently selected sorting algorithm */
async function sort() {
  sortingProgram = new SortingProgram({
    arr: values, 
    states: states, 
    delay: delaySlider.attr('value')
  });
  $("#alg-runtime").text("running...");
  await sortingProgram.runSort(sortingAlgorithm);
}

$("#shuffle-items").click(function() {
  shuffleArray(values);
});

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

/* update text/bars/values when item count slider used */
$('#itemCountSlider').on('input', function() {
  $("#slide-itemCount").text(this.value);
  this.setAttribute('value', this.value);
  setupArray();
  setBarWidth();
});

/* update delay when delay slider used */
$('#delaySlider').on('input', function() {
  $("#slide-delay").text(this.value);
  this.setAttribute('value', this.value);
});

/* instantiate new sorting algorithm when chosen via dropdown */
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
});