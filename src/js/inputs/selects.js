import $ from 'jquery';
import { setSortingStrategy } from '../../index.js';
import { QuickSort, BubbleSort, SelectionSort, InsertionSort, ShellSort, MergeSort } from '../algorithms/exports.js';

/* instantiate new sorting algorithm when chosen via dropdown */
$('#alg-select').on('change', function() {
    switch(this.value) {
      case 'quick':
        setSortingStrategy(new QuickSort());
        break;
      case 'merge':
        setSortingStrategy(new MergeSort());
        break;
      case 'bubble':
        setSortingStrategy(new BubbleSort());
        break;
      case 'selection':
        setSortingStrategy(new SelectionSort());
        break;
      case 'insertion':
        setSortingStrategy(new InsertionSort());
        break;
      case 'shell':
        setSortingStrategy(new ShellSort());
        break;
      default: break;
    }
});