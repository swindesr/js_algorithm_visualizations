import { exchange } from '../util.js';
import { AlgorithmStats } from './algorithmStats.js';
import { SortingAlgorithm } from './sortingAlgorithm.js';

/**
 * The quick sort algorithm.
 */
export class QuickSort extends SortingAlgorithm {
    /**
     * Creates a new QuickSort instance.
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
        await this.qsort(toSort.arr, 0, toSort.arr.length - 1);
        this.info.calculateRuntime();
    }

    /**
     * Returns a description of the bubble sort algorithm.
     * @returns {Object} - See {@link AlgorithmStats}
     */
    getDescriptions() {
        return {
            name: 'Quick Sort',
            about: "By partitioning around a 'pivot' element, quick sort efficiently places items in their correct location. It almost guarantees fast performance by introducing randomness. In this implementation, the partition is chosen as a median of 3 values to improve performance further. For even greater optimization, insertion sort can be applied when dealing with small subproblems.",
            best: 'n log n',
            avg:'2 n log n',
            worst: '1/2 n^2',
            inPlace: true,
            stable: false,
        }
    }

    /**
     * Recursively sorts given arr by partitioning around a pivot.
     * @param {number[]} arr - Array to be sorted 
     * @param {number} lo - Left index 
     * @param {number} hi - Right index 
     * @returns void
     */
    async qsort(arr, lo, hi) {
        if (hi <= lo) return;

        let n = hi - lo + 1
        let m = this.median3(arr, lo, lo + n/2, hi);
        await exchange(arr, m, lo, this);

        let j = await this.partition(arr, lo, hi); // partition array around first entry

        await this.qsort(arr, lo, j-1),  // sort left of partition
        await this.qsort(arr, j+1, hi)   // sort right of partition
    }

    /**
     * Chooses a median of 3 values in given array.
     * @param {number[]} arr - Array of values
     * @param {number} i - First value
     * @param {number} j - Second value 
     * @param {number} k - Third value 
     * @returns {number} Median of i,j,k
     */
    median3(arr, i, j, k) {
        let res;
        if (arr[i] < arr[j]) {
            this.info.compares++;
            if (arr[j] < arr[k]) {
                this.info.compares++;
                res = j;
            } else if (arr[i] < arr[k]) {
                this.info.compares++;
                res = k;
            } else {
                res = i;
            }
        } else {
            this.info.compares++;
            if (arr[k] < arr[j]) {
                this.info.compares++;
                res = j;
            } else if (arr[k] < arr[i]) {
                this.info.compares++;
                res = k;
            } else {
                res = i;
            }
        }
        
        return res;
        // concise representation of logic. Not used due to inability to count compares.
        // (arr[i] < arr[j] ?
        // (arr[j] < arr[k] ? j : arr[i] < arr[k] ? k : i) :
        // (arr[k] < arr[j] ? j : arr[k] < arr[i] ? k : i));
    }

    /**
     * Partitions array elements in range [lo, hi] around pivot element 
     * (located in arr[0]). Then places pivot in its correct position.
     * @param {number[]} arr - Array to be sorted 
     * @param {number} lo - Left index 
     * @param {number} hi - Right index 
     * @returns {number} The final index of pivot in arr
     */
    async partition(arr, lo, hi) {
        let i = lo;
        let j = hi + 1;
        let v = arr[lo]; // partition value

        this.states.fill('being sorted', lo, hi);
        this.states[lo] = 'pivot';

        while (true) {
            
            // increment left pointer until it finds value above partition
            while (arr[++i] < v) {
                this.info.compares++;
                if (i == hi) break;
            }

            // increment right pointer until it finds value below partition
            while (v < arr[--j]) {
                this.info.compares++;
                if (j == lo) break;
            }

            // pointers crossed; partition complete
            if (i >= j) break;

            // swap elements at pointers
            await exchange(arr, i, j, this);
        }
        
        // place partition element into correct location
        await exchange(arr, lo, j, this);
        this.states.fill('default', lo, hi+1);

        // partition final index
        return j;
    }
}