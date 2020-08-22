import { exchange } from '../util.js';
import { SortingAlgorithm } from './sortingAlgorithm.js';

export class InsertionSort extends SortingAlgorithm {
    constructor() {
        super();
    }

    async sort(toSort) {
        super.sort(toSort);
        await this.isort(toSort.arr);
        this.info.calculateRuntime();
    }

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