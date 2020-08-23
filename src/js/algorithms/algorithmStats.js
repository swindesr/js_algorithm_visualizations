import { updateSliderInfoFields } from '../inputs/sliders.js';

/**
 * This class keeps track of statistics associated with the description 
 * and efficiency of an algorithm being used.
 */
export class AlgorithmStats {
    /**
     * Represents a set of descriptions about an algorithm and the statistics
     * associated with its recent performance.
     * @param {Object} algDescription - Object describing an algorithm
     * @param {string} algDescription.name - Algorithm name
     * @param {string} algDescription.about - Paragraph describing algorithm
     * @param {string} algDescription.best - Asymptotic lower bound on runtime
     * @param {string} algDescription.avg - A typical case asymptotic runtime estimate
     * @param {string} algDescription.worst - Asymptotic upper bound on runtime
     * @param {boolean} algDescription.inPlace - Does this sort items with constant additional memory?
     * @param {boolean} algDescription.stable - Does this algorithm maintain relative ordering of equal keys?
     */
    constructor(algDescription) {
        /**
         * @property {string} name - Algorithm name
         */
        this.name = algDescription.name;
        /**
         * @property {string} about - Paragraph describing algorithm
         */
        this.about = algDescription.about;
        /**
         * @property {string} best - Asymptotic lower bound on runtime
         */
        this.best = algDescription.best;
        /**
         * @property {string} algDescription.avg - A typical case asymptotic runtime estimate
         */
        this.avg = algDescription.avg;
        /**
         * @property {string} algDescription.worst - Asymptotic upper bound on runtime
         */
        this.worst = algDescription.worst;
        /**
         * @property {boolean} inPlace - Does this sort items with constant additional memory?
         */
        this.inPlace = algDescription.inPlace;
        /**
         * @property {boolean} stable - Does this algorithm maintain relative ordering of equal keys?
         */
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
     * Populates compare and swap text fields.
     * @returns void
     */
    updateStats() {
        $("#alg-compares").text(this.compares);
        $("#alg-swaps").text(this.swaps);
    }

    /**
     * Clears stats and populates current slider values into their respective text fields.
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
     * @returns void
     */
    calculateRuntime() {
        this.endTime = performance.now();
        this.runtime = this.endTime - this.startTime;
        $("#alg-runtime").text(Math.floor(this.runtime) + "ms");
    }
}