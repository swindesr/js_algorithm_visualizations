import { toggleInputs, generateDefaultStateArray } from './js/util.js';
import { updateSliderInfoFields, getDelay, getItemCount } from './js/inputs/sliders.js';
import { SortingProgram, QuickSort } from './js/algorithms/exports.js';
import './js/inputs/buttons.js';
import './js/inputs/selects.js';

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

/**
 * Enables instance mode for p5js when passed to new p5(). Will bind all
 * p5 library methods to parameter so as to not pollute global namespace.
 * @param {Object} p - A p5 sketch object.
 * @returns void
 */
const sketch = (p) => {
  /**
   * Called when program starts to initialize p5js environment and canvas.
   * @returns void
   */
  p.setup = () => {
    let renderer = p.createCanvas(width, height);
    renderer.parent('p5js');

    updateSliderInfoFields();
    updateValuesAndStates();
    setBarWidth();
    toggleInputs(true);
  }

  /** 
   * Called continuously (or until noLoop() is called) to render
   * all p5 elements to the parent container.
   */
  p.draw = () => {
    p.background(BG_COLOR);
    for (let i = 0; i < values.length; i++) {
      drawBarWithState(i);
    }
  }

  /**
   * Renders a single bar and colors based on current state.
   * @param {number} i - Index representing element in value array
   * @returns void
   */
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
    p.rect(i * barWidth, height - values[i] - 2, barWidth, values[i] + 2);
  }

  /**
   * Called when window is resized; adjusts canvas dimensions to fit new window. 
   * @returns void
   */
  p.windowResized = () => {
    width = $('#p5js').width();
    height = $('#p5js').height();
    p.resizeCanvas(width, height);
    setBarWidth();
  }
}

/* instance mode for p5js */
new p5(sketch, 'p5js')

/**
 * Updates value and state arrays to match current item count.
 * @returns void
 */
function updateValuesAndStates() {
  [values, states] = generateDefaultStateArray(getItemCount());
}

/**
 * Sets bar width.
 * @returns void
 */
function setBarWidth() {
  barWidth = width / getItemCount();
}

/**
 * Sets sorting strategy.
 * @param {SorthingAlgorithm} strategy - Sorting algorithm to be used
 * @returns void
 */
function setSortingStrategy(strategy) {
  sortingStrategy = strategy;
}

/**
 * Sorts values based on current sorting strategy.
 * @returns void
 */
async function sort() {
  sortingProgram = new SortingProgram({
      arr: values,
      states: states,
      delay: getDelay()
  });
  $("#alg-runtime").text("running...");
  await sortingProgram.runSort(sortingStrategy);
}

export { values, setBarWidth, setSortingStrategy, sort, updateValuesAndStates };