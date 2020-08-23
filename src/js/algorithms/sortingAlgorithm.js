import { AlgorithmStats } from './algorithmStats.js';

/**
 * A generic sorting algorithm interface.
 */
export class SortingAlgorithm {
    /**
     * Creates a new SortingAlgorithm and updates its descriptions.
     */
    constructor() {
        this.info = new AlgorithmStats(this.getDescriptions());
    }

    /**
     * Object containing array to be sorted, delay, and states
     * @typedef {Object} toSort
     * @property {Object} toSort - Object containing array to be sorted, and additional parameters
     * @property {number[]} arr - Array of values to sort
     * @property {string[]} states - State of elements in array
     * @property {number} delay - Delay to be used during swapping (in ms)
     */

    /**
     * Resets associated {@link AlgorithmStats} and sorts given array.
     * @param {toSort} toSort - Object containing array to be sorted, delay, and states
     * @returns void
     */
    async sort(toSort) {
        this.info.refresh();
        this.states = toSort.states;
        this.delay = toSort.delay;
    }

    /**
     * Returns information about this algorithm. 
     * @returns {Object} - See {@link AlgorithmStats}
     */
    getDescriptions() {
        return {};
    }
}