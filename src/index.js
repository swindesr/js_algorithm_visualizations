/* define jQuery here to give all imported scripts access */
const jquery = require("jquery");
window.$ = window.jQuery = jquery;

/* script imports */
import P5 from 'p5';
import { toggleInputs, generateDefaultStateArray } from './js/util.js';
import { updateSliderInfoFields, getDelay, getItemCount } from './js/inputs/sliders.js';
import { SortingProgram, QuickSort } from './js/algorithms/exports.js';
import './js/inputs/buttons.js';
import './js/inputs/selects.js';

/* style imports */
import 'bootstrap/dist/css/bootstrap.css';
import './styles/styles.css';

/* sizing values */
let width = $('#p5js').width();
let height = $('#p5js').height();
let barWidth; // dependent on number of bars & screen width

/* color values */
const BG_COLOR = [0,0,0];
const DEFAULT_BAR_COLOR = [170,170,170];
const BEING_SORTED_BAR_COLOR = [255,255,255];
const BEING_EXCHANGED_BAR_COLOR = [75,255,75];
const PIVOT_BAR_COLOR = [255,50,50]

/* array to be sorted */
let values = [];
let states = [];

/* algorithm managment */
let sortingProgram = new SortingProgram(values, states, getDelay());
let sortingStrategy = new QuickSort();

const p5sketch = (p) => {
  /* called once when program starts to initialize p5js environment */
  p.setup = () => {
    let renderer = p.createCanvas(width, height);
    renderer.parent('p5js');

    updateSliderInfoFields();
    updateValuesAndStates();
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
  function drawBarWithState(i) {
    if (states[i] == 'default') {
      p.fill(DEFAULT_BAR_COLOR);
    } else if (states[i] == 'pivot') {
      p.fill(PIVOT_BAR_COLOR);
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

function updateValuesAndStates() {
  [values, states] = generateDefaultStateArray(getItemCount());
}

function getValues() {
  return values;
}

function setBarWidth() {
  barWidth = width / getItemCount();
}

function setSortingStrategy(strategy) {
  sortingStrategy = strategy;
}

/* sort values based on currently selected sorting algorithm */
async function sort() {
  sortingProgram = new SortingProgram({
      arr: values,
      states: states,
      delay: getDelay()
  });
  $("#alg-runtime").text("running...");
  await sortingProgram.runSort(sortingStrategy);
}

export { getValues, setBarWidth, setSortingStrategy, sort, updateValuesAndStates };