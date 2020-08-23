import { exchange } from '../util.js';
import { SortingAlgorithm } from './sortingAlgorithm.js';

/**
 * The bubble sort algorithm.
 */
export class SelectionSort extends SortingAlgorithm{
    /**
     * Creates a new SelectionSort instance.
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
        await this.ssort(toSort.arr);
        this.info.calculateRuntime();
    }

    /**
     * Returns a description of the bubble sort algorithm.
     * @returns {Object} - See {@link AlgorithmStats}
     */
    getDescriptions() {
        return {
            name: 'Selection Sort',
            about: "One of the simplest sorting methods, selection sort scans the array for the smallest item and places it in position one. It then moves up one position and repeats itself. While not impressively efficient, selection sort guarantees one swap per array entry, so it can be useful in cases where swapping is expensive.",
            best: '1/2 n^2',
            avg: '1/2 n^2',
            worst: '1/2 n^2',
            inPlace: true,
            stable: false,
        }
    }

    /**
     * Sorts array using selection sort algorithm.
     * @param {number[]} arr - Array to be sorted 
     * @returns void
     */
    async ssort(arr) {
        let n = arr.length;
        for (let i = 0; i < n; i++) {
            this.states[i] = 'being sorted';
        }
        
        for (let i = 0; i < n; i++) {
            let min = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[min]) min = j;
                this.info.compares++;
            }
            await exchange(arr, i, min, this);
            this.states[i] = 'default';
        }
    }
}