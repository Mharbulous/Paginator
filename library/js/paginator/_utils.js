/**
 * _utils.js
 *
 * This file contains utility functions used by the Paginator.
 */

/**
 * Converts a CSS unit value (e.g., "8.5in", "30px") to pixels.
 * @param {string} value - The CSS value string.
 * @returns {number} The value in pixels.
 */
export function _convertCssUnitToPx(value) {
    if (typeof value === 'number') return value; // Already a number (assumed px)

    const numericValue = parseFloat(value);
    const unit = value.replace(/[0-9.]/g, '');

    // Create a temporary element to measure the unit in pixels
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '1' + unit;
    document.body.appendChild(tempDiv);
    const pxPerUnit = tempDiv.offsetWidth;
    document.body.removeChild(tempDiv);

    return numericValue * pxPerUnit;
}

/**
 * Debounces a function call.
 * @param {function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @param {boolean} immediate - If true, trigger the function on the leading edge.
 * @returns {function} The debounced function.
 */
export function _debounce(func, delay, immediate = false) {
    let timeout;
    let result;
    return function(...args) {
        const context = this;
        const later = function() {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
            }
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
        if (callNow) {
            result = func.apply(context, args);
        }
        return result;
    };
}
