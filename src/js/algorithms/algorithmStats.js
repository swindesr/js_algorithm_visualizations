import { updateSliderInfoFields } from '../inputs/sliders.js';

/**
 * Class to create an AlgorithmStats object. This class keeps track of statistics
 * associates with the description and efficiency of an algorithm being used.
 */
export class AlgorithmStats {
    /**
     * Represents a set of descriptions about an algorithm and the statistics
     * associated with its recent performance.
     * @param {Object} algDescription - Object describing an algorithm
     * @param {string} algDescription.name - Algorithm Name
     * @param {string} algDescription.about - Paragraph describing algorithm
     * @param {string} algDescription.best - Asymptotic lower bound on runtime
     * @param {string} algDescription.avg - A typical case asymptotic runtime estimate
     * @param {string} algDescription.worst - Asymptotic upper bound on runtime
     * @param {boolean} algDescription.inPlace - Does this sort items with constant additional memory?
     * @param {boolean} algDescription.stable - Does this algorithm maintain relative ordering of equal keys?
     */
    constructor(algDescription) {
        this.name = algDescription.name;
        this.about = algDescription.about;
        this.best = algDescription.best;
        this.avg = algDescription.avg;
        this.worst = algDescription.worst;
        this.inPlace = algDescription.inPlace;
        this.stable = algDescription.stable;
        /**
         * @property {number} compares - Number of times the algorithm has compared array elements
         */
        this.compares = 0;
        /**
         * @property {number} swaps - Number of times the algorithm has swapped array elements
         */
        this.swaps = 0;
        /**
         * @property {double} startTime - The timestamp created when an algorithm begins running
         */
        this.startTime = 0.0;
        /**
         * @property {double} endTime - The timestamp created when an algorithm ends running
         */
        this.endTime = 0.0;
        this.updateInfoFields();
    }

    /**
     * Populates all description fields with relevant algorithm information.
     * @returns void
     */
    updateInfoFields() {
        $('#alg-name').text(this.name);
        $('#alg-about').text(this.about);
        $('#alg-best').text(this.best);
        $('#alg-avg').text(this.avg);
        $('#alg-worst').text(this.worst);
        $('#alg-place').text(this.inPlace == true ? 'yes' : 'no');
        $('#alg-stable').text(this.stable == true ? 'yes' : 'no');
    }

    /**
     * Populates compare and swap info fields.
     * @returns void
     */
    updateStats() {
        $("#alg-compares").text(this.compares);
        $("#alg-swaps").text(this.swaps);
    }

    /**
     * Clears stats and populates current slider values into their text fields.
     * @returns void
     */
    refresh() {
        updateSliderInfoFields();
        this.compares = 0;
        this.swaps = 0;
        this.startTime = performance.now();
    }

    /**
     * Determines time since this object was last refreshed.
     */
    calculateRuntime() {
        this.endTime = performance.now();
        this.runtime = this.endTime - this.startTime;
        $("#alg-runtime").text(Math.floor(this.runtime) + "ms");
    }
}