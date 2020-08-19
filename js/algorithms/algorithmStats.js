export class AlgorithmStats {
    constructor(algInfo) {
        this.updateInfoFields(algInfo);
        this.compares = 0;
        this.swaps = 0;
        this.startTime = performance.now();
        this.endTime;
        this.runtime = 0; // in ms
    }

    updateInfoFields(algInfo) {
        $('#alg-name').text(algInfo.name);
        $('#alg-about').text(algInfo.about);
        $('#alg-best').text(algInfo.best);
        $('#alg-avg').text(algInfo.avg);
        $('#alg-worst').text(algInfo.worst);
        $('#alg-place').text(algInfo.inPlace);
        $('#alg-stable').text(algInfo.stable);
      }

    updateStats() {
        $("#alg-compares").text(this.compares);
        $("#alg-swaps").text(this.swaps);
    }

    calculateRuntime() {
        this.endTime = performance.now();
        this.runtime = this.endTime - this.startTime;
        $("#alg-runtime").text(Math.floor(this.runtime) + "ms");
    }
}