/**
 * _pagination-core.js
 *
 * This file contains the core pagination logic for calculating and rendering pages.
 */

import { _convertCssUnitToPx } from './_utils.js';

/**
 * Removes all temporary elements (e.g., page break spacers) from the ink layer.
 * @param {object} paginatorInstance - The Paginator instance.
 */
export function _clearPaginationHelpers(paginatorInstance) {
    paginatorInstance.inkLayer.querySelectorAll('.pgntr-page-break-spacer').forEach(spacer => spacer.remove());
}

/**
 * Calculates required page cards and renders them in the paper layer.
 * Also calculates and stores page content boundaries.
 * @param {object} paginatorInstance - The Paginator instance.
 */
export function _calculateAndRenderPageCards(paginatorInstance) {
    const inkContentHeight = paginatorInstance.inkLayer.scrollHeight;
    const pageHeightPx = _convertCssUnitToPx(paginatorInstance.options.pageHeight);
    const pageInsetPx = _convertCssUnitToPx(paginatorInstance.options.pageInset);
    const pageGapPx = _convertCssUnitToPx(paginatorInstance.options.pageGap);

    // Calculate the actual content height available per page
    const contentHeightPerPage = pageHeightPx - (2 * pageInsetPx);

    // Calculate total pages needed based on ink content height.
    // This accounts for the inset at the top of the first page and bottom of the last page,
    // as well as the gaps between pages.
    let totalPages = 1;
    if (inkContentHeight > contentHeightPerPage) {
        // Subtract the initial top inset of the ink layer, which aligns with the first page's content area.
        const effectiveInkContentHeight = inkContentHeight - pageInsetPx;
        totalPages = Math.ceil(effectiveInkContentHeight / (contentHeightPerPage + pageGapPx));
        // Ensure at least one page if there's any content
        if (totalPages === 0 && inkContentHeight > 0) totalPages = 1;
    }

    // Remove excess page cards
    while (paginatorInstance.paperLayer.children.length > totalPages) {
        paginatorInstance.paperLayer.removeChild(paginatorInstance.paperLayer.lastChild);
    }

    // Add missing page cards
    while (paginatorInstance.paperLayer.children.length < totalPages) {
        const pageCard = document.createElement('div');
        pageCard.classList.add('pgntr-page-card');
        paginatorInstance.paperLayer.appendChild(pageCard);
    }

    // Store page boundaries for later use in pagination logic
    paginatorInstance.pageBoundaries = [];
    let currentY = 0; // Y-coordinate relative to the top of the ink layer
    for (let i = 0; i < totalPages; i++) {
        const pageTop = currentY + pageInsetPx;
        const pageBottom = currentY + pageHeightPx - pageInsetPx;
        paginatorInstance.pageBoundaries.push({ top: pageTop, bottom: pageBottom });
        currentY += pageHeightPx + pageGapPx;
    }
}

/**
 * Queries the ink layer for breakable elements and sorts them by document order.
 * @param {object} paginatorInstance - The Paginator instance.
 * @returns {HTMLElement[]} Array of breakable elements.
 */
export function _getBreakableElements(paginatorInstance) {
    const breakableElements = Array.from(paginatorInstance.inkLayer.querySelectorAll(paginatorInstance.options.breakableSelector));
    // Ensure the sentinel breakable exists and is included
    _ensureSentinelBreakableExists(paginatorInstance);
    const sentinel = paginatorInstance.inkLayer.lastElementChild;
    if (sentinel && !breakableElements.includes(sentinel)) {
        breakableElements.push(sentinel);
    }
    // Sort by their position in the DOM
    breakableElements.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    return breakableElements;
}

/**
 * Processes breakable elements, inserting spacers where content overflows.
 * @param {object} paginatorInstance - The Paginator instance.
 */
export function _processBreakableElements(paginatorInstance) {
    const breakableElements = _getBreakableElements(paginatorInstance);
    let currentPageIndex = 0;
    const pageHeightPx = _convertCssUnitToPx(paginatorInstance.options.pageHeight);
    const pageInsetPx = _convertCssUnitToPx(paginatorInstance.options.pageInset);
    const pageGapPx = _convertCssUnitToPx(paginatorInstance.options.pageGap);

    // Get the bounding rectangle of the ink layer relative to the viewport
    const inkLayerRect = paginatorInstance.inkLayer.getBoundingClientRect();

    for (const element of breakableElements) {
        const elementRect = element.getBoundingClientRect();
        // Calculate element's top relative to the ink layer's content area start
        const elementTopInInkLayer = elementRect.top - inkLayerRect.top;

        // Find which page this element currently "thinks" it's on
        while (currentPageIndex < paginatorInstance.pageBoundaries.length - 1 &&
               elementTopInInkLayer >= paginatorInstance.pageBoundaries[currentPageIndex].bottom) {
            currentPageIndex++;
        }

        const currentPageBottom = paginatorInstance.pageBoundaries[currentPageIndex].bottom;

        // Check for overflow
        if (elementTopInInkLayer + elementRect.height > currentPageBottom) {
            // This element overflows the current page. Insert a spacer before it.
            const spaceNeeded = (currentPageBottom - elementTopInInkLayer);
            _insertPageBreakBeforeElement(element, spaceNeeded);
            // After inserting a spacer, the element is effectively on the next page.
            // Increment page index to reflect this for subsequent elements.
            currentPageIndex++;
        }
    }
}

/**
 * Inserts a page break spacer before a given element.
 * @param {HTMLElement} element - The element to insert a spacer before.
 * @param {number} spaceNeeded - The amount of space needed to push the element to the next page.
 */
export function _insertPageBreakBeforeElement(element, spaceNeeded) {
    const spacer = document.createElement('div');
    spacer.classList.add('pgntr-page-break-spacer');
    // The spacer's height is the remaining space on the current page
    spacer.style.height = `${spaceNeeded}px`;
    element.parentNode.insertBefore(spacer, element);

    // Apply print-specific page break style to the element itself
    element.style.breakBefore = 'page';
}

/**
 * Ensures a zero-height breakable element is present as the last child of the ink layer.
 * This helps in accurately calculating the height of the final content block.
 * @param {object} paginatorInstance - The Paginator instance.
 */
export function _ensureSentinelBreakableExists(paginatorInstance) {
    const lastChild = paginatorInstance.inkLayer.lastElementChild;
    if (!lastChild || !lastChild.classList.contains('breakable') || lastChild.offsetHeight !== 0) {
        const sentinel = document.createElement('div');
        sentinel.classList.add('breakable');
        sentinel.style.height = '0';
        sentinel.style.overflow = 'hidden'; // Ensure it doesn't affect layout visually
        paginatorInstance.inkLayer.appendChild(sentinel);
    }
}
