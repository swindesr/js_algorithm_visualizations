export class SortingProgram {
    constructor(toSort) {
        this.toSort = toSort
    }

    /* sorts items based on given sorting instance's sort() method */
    async runSort(sortingStrategy) {
        return sortingStrategy.sort(this.toSort);
    }
}