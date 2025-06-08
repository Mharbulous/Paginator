/**
 * _options.js
 *
 * This file contains methods for parsing and managing Paginator options.
 */

export function _parseOptions(containerElement, options) {
    const defaultOptions = {
        pageWidth: '8.5in',
        pageHeight: '11in',
        pageInset: '0.5in',
        pageGap: '30px',
        breakableSelector: '.breakable',
        debounceTime: 150, // ms
        scrollDebounceTime: 500, // ms
        heightChangeThreshold: 1 // px
    };

    const dataOptions = {};
    for (const key in defaultOptions) {
        const dataAttr = containerElement.dataset[_kebabCase(key)];
        if (dataAttr !== undefined) {
            dataOptions[key] = dataAttr;
        }
    }

    return { ...defaultOptions, ...dataOptions, ...options };
}

export function _kebabCase(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
