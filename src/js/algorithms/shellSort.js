import { exchange } from '../util.js';
import { SortingAlgorithm } from './sortingAlgorithm.js';

/**
 * The shell sort algorithm.
 */
export class ShellSort extends SortingAlgorithm {
    /**
     * Creates a new ShellSort instance.
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
            name: 'Shell Sort',
            about: "Shell sort first compares items far apart and then reduces this gap with each successive loop. It requires fewer swaps on average and will reduce to insertion sort once the array is mostly sorted. Choosing an efficient set of swap gaps is a surprisingly tricky mathematical endeavor. The true time complexity of this algorithm remains unknown.",
            best: 'n log3 n',
            avg: 'n/a',
            worst: 'c n^3/2',
            inPlace: true,
            stable: false,
        }
    }

    /**
     * Sorts array using shell sort algorithm.
     * @param {number[]} arr - Array to be sorted 
     * @returns void
     */
    async ssort(arr) {
        let n = arr.length;

        let h = 1;
        while (h < n/3) h = 3*h + 1; // initialize Knuth gap sequence
        
        while (h >= 1) {
            for (let i = h; i < n; i++) {
                this.states[i] = 'being sorted';
                for (let j = i; j >= h && (arr[j] < arr[j-h]); j -= h) {
                    this.info.compares++;
                    await exchange(arr, j, j-h, this);
                }
                this.info.compares++;
            }

            this.states.fill('default');
            h = Math.floor(h / 3);
        }
    }
}