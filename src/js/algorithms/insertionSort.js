import { exchange } from '../util.js';
import { SortingAlgorithm } from './sortingAlgorithm.js';

/**
 * The insertion sort algorithm.
 */
export class InsertionSort extends SortingAlgorithm {
    /**
     * Creates a new InsertionSort instance.
     */
    constructor() {
        super();
    }

    /**
     * Sorts the given array and updates statistics/description fields.
     * @param {toSort} toSort - Object containing array to be sorted, and additional parameters
     * @returns void
     */
    async sort(toSort) {
        super.sort(toSort);
        await this.isort(toSort.arr);
        this.info.calculateRuntime();
    }

    /**
     * Returns a description of the bubble sort algorithm.
     * @returns {Object} - See {@link AlgorithmStats}
     */
    getDescriptions() {
        return {
            name: 'Insertion Sort',
            about: "Insertion sort places items into their correct position relative to any items already processed. It is exceptionally good at sorting arrays with only a few items out of place. As such, it is often used to optimize small subproblems in other sorting methods.",
            best: 'n',
            avg: '1/4 n^2',
            worst: '1/2 n^2',
            inPlace: true,
            stable: true,
        }
    }

    /**
     * Sorts the given array using the insertion sort algorithm.
     * Also manages the state of items for display purposes.
     * @param {number[]} arr - Array to be sorted 
     * @returns void
     */
    async isort(arr) {
        let n = arr.length;
        
        for (let i = 1; i < n; i++) {
            this.states[i] = 'being sorted';
            for (let j = i; j > 0 && (arr[j] < arr[j-1]); j--) {
                this.info.compares++;
                await exchange(arr, j, j-1, this);
            }
            this.info.compares++;
        }

        this.states.fill('default');
    }
}