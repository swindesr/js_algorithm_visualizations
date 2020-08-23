/**
 * Manages strategies used to sort items.
 */
export class SortingProgram {
    /**
     * Creates a new SortingProgram instance.
     * @param {toSort} toSort - Object containing array to be sorted, and additional parameters
     */
    constructor(toSort) {
        this.toSort = toSort
    }

    /** 
     * Sorts items based on given sorting instance's sort() method 
     * @param {SortingAlgorithm} sortingStrategy - A subclass of SortingAlgorithm that can sort arrays of numbers.
    */
    async runSort(sortingStrategy) {
        return sortingStrategy.sort(this.toSort);
    }
}