/**
 * _pagination-validation.js
 *
 * This file contains the secondary validation logic for spacer positions.
 */

import { _convertCssUnitToPx } from './_utils.js';

/**
 * Performs a secondary validation of spacer positions, triggered by scroll.
 * This handles edge cases where content shifts without changing total scrollHeight.
 * @param {object} paginatorInstance - The Paginator instance.
 */
export function _performSecondarySpacerValidation(paginatorInstance) {
    if (paginatorInstance.isUpdating) return;

    const pageHeightPx = _convertCssUnitToPx(paginatorInstance.options.pageHeight);
    const pageInsetPx = _convertCssUnitToPx(paginatorInstance.options.pageInset);
    const pageGapPx = _convertCssUnitToPx(paginatorInstance.options.pageGap);
    const inkLayerRect = paginatorInstance.inkLayer.getBoundingClientRect();

    let needsUpdate = false;
    const spacers = Array.from(paginatorInstance.inkLayer.querySelectorAll('.pgntr-page-break-spacer'));

    for (let i = 0; i < spacers.length; i++) {
        const spacer = spacers[i];
        const nextElement = spacer.nextElementSibling;

        if (nextElement && nextElement.classList.contains('breakable')) {
            const nextElementRect = nextElement.getBoundingClientRect();
            const nextElementTopInInkLayer = nextElementRect.top - inkLayerRect.top;

            // Calculate which page this element *should* be on based on its position
            // and the ideal page boundaries.
            let idealPageIndex = 0;
            let idealPageTop = pageInsetPx; // Top of content area on first page

            // Iterate through pages to find the ideal page for this element
            for (let p = 0; p < paginatorInstance.pageBoundaries.length; p++) {
                const pageContentTop = (p * (pageHeightPx + pageGapPx)) + pageInsetPx;
                if (nextElementTopInInkLayer >= pageContentTop) {
                    idealPageIndex = p;
                    idealPageTop = pageContentTop;
                } else {
                    break; // Found the page it should be on
                }
            }

            // The element should ideally be at the top of its page's content area.
            // Check if its current position is significantly off.
            const currentElementTopRelativeToPage = nextElementTopInInkLayer - idealPageTop;

            // Allow for minor pixel discrepancies due to rendering
            if (Math.abs(currentElementTopRelativeToPage) > paginatorInstance.options.heightChangeThreshold) {
                needsUpdate = true;
                break;
            }
        }
    }

    if (needsUpdate) {
        console.log("Paginator: Secondary spacer validation triggered update.");
        paginatorInstance.updatePagination();
    }
    paginatorInstance.userHasScrolledRecently = false; // Reset after validation
}
