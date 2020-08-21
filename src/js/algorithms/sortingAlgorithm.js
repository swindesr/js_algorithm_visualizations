import { AlgorithmStats } from './algorithmStats.js';

export class SortingAlgorithm {
    constructor() {
        this.info = new AlgorithmStats(this.getDescriptions());
    }

    async sort(toSort) {
        this.info.refresh();
        this.states = toSort.states;
        this.delay = toSort.delay;
    }

    getDescriptions() {
        return {};
    }
}