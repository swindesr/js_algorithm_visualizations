import $ from 'jquery';
import { updateValuesAndStates, setBarWidth } from '../../index.js';

/* sliders */
const ITEM_COUNT_SLIDER = $('#itemCountSlider');
const DELAY_SLIDER = $('#delaySlider');

function getItemCount() {
    return parseInt(ITEM_COUNT_SLIDER.attr('value'));
}

function getDelay() {
    return DELAY_SLIDER.attr('value');
}

/* render slider values to appropriate text fields */
function updateSliderInfoFields() {
    $('#alg-items').text(ITEM_COUNT_SLIDER.attr('value'));
    $('#alg-delay').text(DELAY_SLIDER.attr('value'));
}

/* update text/bars/values when item count slider used */
ITEM_COUNT_SLIDER.on('input', function () {
    $("#slide-itemCount").text(this.value);
    this.setAttribute('value', this.value);
    updateValuesAndStates();
    setBarWidth();
});

/* update delay when delay slider used */
DELAY_SLIDER.on('input', function () {
    $("#slide-delay").text(this.value);
    this.setAttribute('value', this.value);
});

export { updateSliderInfoFields, getItemCount, getDelay };