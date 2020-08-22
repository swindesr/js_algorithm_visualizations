import $ from 'jquery';
import { toggleInputs } from '../util.js';
import { shuffleArray } from '../random.js';
import { sort, values } from '../../index.js';

$("#run").click(async function () {
    toggleInputs(false);
    await sort();
    toggleInputs(true);
});

/* shuffles items in values array */
$("#shuffle-items").click(function () {
    shuffleArray(values);
});