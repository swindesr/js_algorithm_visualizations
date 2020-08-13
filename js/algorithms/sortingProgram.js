export class SortingProgram {
    constructor(arr, states, delay) {
        this.arr = arr;
        this.states = states;
        this.delay = delay;
    }

    async runSort(sortingStrategy) {
        return sortingStrategy.sort(this.arr, this.states, this.delay);
    }
}