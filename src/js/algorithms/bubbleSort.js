import { exchange } from '../util.js';
import { SortingAlgorithm } from './sortingAlgorithm.js';

/**
 * The bubble sort algorithm.
 */
export class BubbleSort extends SortingAlgorithm {
    /**
     * Creates a new BubbleSort instance.
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
        await this.bsort(toSort.arr);
        this.info.calculateRuntime();
    }

    /**
     * Returns a description of the bubble sort algorithm.
     * @returns {Object} - See {@link AlgorithmStats}
     */
    getDescriptions() {
        return {
            name: 'Bubble Sort',
            about: "Often used as a teaching tool, bubble sort is very slow. It sorts a given array by comparing neighboring elements and 'bubbling' the larger element up towards the final position. Even with some optimizations, this still lacks efficiency and is not often used in practice.",
            best: 'n',
            avg: '1/2 n^2',
            worst: '1/2 n^2',
            inPlace: true,
            stable: true,
        }
    }

    /**
     * Sorts the given array using the bubble sort algorithm.
     * Also manages the state of items for display purposes.
     * @param {number[]} arr - Array to be sorted 
     * @returns void
     */
    async bsort(arr) {
        let n = arr.length;
        this.states.fill('being sorted');

        while (n > 1) {
            let sortedAfterIndex = 0;
            for (let i = 1; i < n; i++) {
                if (arr[i - 1] > arr[i]) await exchange(arr, i - 1, i, this);
                this.info.compares++;
                sortedAfterIndex = i;
            }
            this.states[sortedAfterIndex] = 'default';
            n = sortedAfterIndex;
        }
    }
}