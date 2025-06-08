/**
 * _observers.js
 *
 * This file contains methods for setting up ResizeObservers and MutationObserver.
 */

import { _debounce } from './_utils.js';

export function _setupObservers(paginatorInstance) {
    // ResizeObserver for Ink Layer
    paginatorInstance.resizeObserverInk = new ResizeObserver(_debounce((entries) => {
        const entry = entries[0];
        const currentHeight = entry.borderBoxSize[0].blockSize;
        const previousHeight = entry.target._previousHeight || 0;

        if (Math.abs(currentHeight - previousHeight) > paginatorInstance.options.heightChangeThreshold && !paginatorInstance.isUpdating) {
            paginatorInstance.updatePagination();
        } else if (paginatorInstance.userHasScrolledRecently) {
            paginatorInstance._performSecondarySpacerValidation();
        }
        entry.target._previousHeight = currentHeight;
    }, paginatorInstance.options.debounceTime));
    paginatorInstance.resizeObserverInk.observe(paginatorInstance.inkLayer);

    // ResizeObserver for Container
    paginatorInstance.resizeObserverContainer = new ResizeObserver(_debounce(() => {
        if (!paginatorInstance.isUpdating) {
            paginatorInstance.updatePagination();
        }
    }, paginatorInstance.options.debounceTime));
    paginatorInstance.resizeObserverContainer.observe(paginatorInstance.containerElement);

    // MutationObserver for Ink Layer
    paginatorInstance.mutationObserverInk = new MutationObserver(_debounce(() => {
        if (!paginatorInstance.isUpdating) {
            paginatorInstance.updatePagination();
        }
    }, paginatorInstance.options.debounceTime));
    paginatorInstance.mutationObserverInk.observe(paginatorInstance.inkLayer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
}
