/**
 * paginator.js
 *
 * This file contains the core Paginator JavaScript class, responsible for:
 * - Initializing the paginator component on a given HTML container.
 * - Dynamically handling pagination and layout adjustments based on content changes.
 * - Utilizing ResizeObserver and MutationObserver for real-time updates.
 * - Providing public methods like `updatePagination()` and `destroy()`.
 * - Accepting configuration options via constructor or data-* attributes.
 */

class Paginator {
    constructor(containerElement, options = {}) {
        if (!(containerElement instanceof HTMLElement)) {
            console.error("Paginator: Invalid container element provided. Must be an HTMLElement.");
            return;
        }

        this.containerElement = containerElement;
        this.options = this._parseOptions(options);

        this.paperLayer = null;
        this.inkLayer = null;
        this.consoleLayer = null;

        this.isUpdating = false;
        this.userHasScrolledRecently = false;
        this.lastScrollTime = 0;

        this.resizeObserverInk = null;
        this.resizeObserverContainer = null;
        this.mutationObserverInk = null;

        this._setupLayers();
        if (!this.paperLayer || !this.inkLayer || !this.consoleLayer) {
            console.error("Paginator: Required layers not found or duplicated. Initialization aborted.");
            return;
        }

        this._setupObservers();
        this._setupListeners();
        this._ensureSentinelBreakableExists();
        this.updatePagination(); // Initial pagination
    }

    /**
     * Parses options from data attributes and merges with provided options.
     * @param {object} options - Options passed during instantiation.
     * @returns {object} Merged options.
     * @private
     */
    _parseOptions(options) {
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
            const dataAttr = this.containerElement.dataset[this._kebabCase(key)];
            if (dataAttr !== undefined) {
                dataOptions[key] = dataAttr;
            }
        }

        return { ...defaultOptions, ...dataOptions, ...options };
    }

    /**
     * Converts camelCase to kebab-case for data attributes.
     * @param {string} str - The camelCase string.
     * @returns {string} The kebab-case string.
     * @private
     */
    _kebabCase(str) {
        return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
    }

    /**
     * Identifies and validates the core Paginator layers within the container.
     * @private
     */
    _setupLayers() {
        const paperLayers = this.containerElement.querySelectorAll('.pgntr-paper-layer');
        const inkLayers = this.containerElement.querySelectorAll('.pgntr-ink-layer');
        const consoleLayers = this.containerElement.querySelectorAll('.pgntr-console-layer');

        if (paperLayers.length !== 1) {
            console.error("Paginator: Exactly one '.pgntr-paper-layer' is required inside the paginator container.");
        } else {
            this.paperLayer = paperLayers[0];
        }

        if (inkLayers.length !== 1) {
            console.error("Paginator: Exactly one '.pgntr-ink-layer' is required inside the paginator container.");
        } else {
            this.inkLayer = inkLayers[0];
        }

        if (consoleLayers.length !== 1) {
            console.error("Paginator: Exactly one '.pgntr-console-layer' is required inside the paginator container.");
        } else {
            this.consoleLayer = consoleLayers[0];
        }
    }

    /**
     * Sets up ResizeObservers and MutationObserver for dynamic updates.
     * @private
     */
    _setupObservers() {
        // ResizeObserver for Ink Layer
        this.resizeObserverInk = new ResizeObserver(this._debounce((entries) => {
            const entry = entries[0];
            const currentHeight = entry.borderBoxSize[0].blockSize;
            const previousHeight = entry.target._previousHeight || 0;

            if (Math.abs(currentHeight - previousHeight) > this.options.heightChangeThreshold && !this.isUpdating) {
                this.updatePagination();
            } else if (this.userHasScrolledRecently) {
                this._performSecondarySpacerValidation();
            }
            entry.target._previousHeight = currentHeight;
        }, this.options.debounceTime));
        this.resizeObserverInk.observe(this.inkLayer);

        // ResizeObserver for Container
        this.resizeObserverContainer = new ResizeObserver(this._debounce(() => {
            if (!this.isUpdating) {
                this.updatePagination();
            }
        }, this.options.debounceTime));
        this.resizeObserverContainer.observe(this.containerElement);

        // MutationObserver for Ink Layer
        this.mutationObserverInk = new MutationObserver(this._debounce(() => {
            if (!this.isUpdating) {
                this.updatePagination();
            }
        }, this.options.debounceTime));
        this.mutationObserverInk.observe(this.inkLayer, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    /**
     * Sets up scroll and print listeners.
     * @private
     */
    _setupListeners() {
        // Scroll Listener
        window.addEventListener('scroll', this._debounce(() => {
            this.userHasScrolledRecently = true;
            this.lastScrollTime = Date.now();
            // Reset the flag after a timeout if no further scroll occurs
            setTimeout(() => {
                if (Date.now() - this.lastScrollTime >= this.options.scrollDebounceTime) {
                    this.userHasScrolledRecently = false;
                }
            }, this.options.scrollDebounceTime + 50); // A little buffer
        }, 50, true)); // Use a very short debounce for scroll to update flag quickly

        // Print Listener
        window.addEventListener('beforeprint', () => {
            if (!this.isUpdating) {
                this.updatePagination();
            }
        });
    }

    /**
     * The main method to trigger and orchestrate pagination updates.
     * @public
     */
    updatePagination() {
        if (this.isUpdating) {
            console.warn("Paginator: updatePagination() called while an update is already in progress. Skipping.");
            return;
        }
        this.isUpdating = true;
        console.log("Paginator: Starting pagination update.");

        this._clearPaginationHelpers();
        this._calculateAndRenderPageCards();
        this._processBreakableElements();

        this.isUpdating = false;
        console.log("Paginator: Pagination update complete.");
    }

    /**
     * Removes all temporary elements (e.g., page break spacers) from the ink layer.
     * @private
     */
    _clearPaginationHelpers() {
        this.inkLayer.querySelectorAll('.pgntr-page-break-spacer').forEach(spacer => spacer.remove());
    }

    /**
     * Calculates required page cards and renders them in the paper layer.
     * Also calculates and stores page content boundaries.
     * @private
     */
    _calculateAndRenderPageCards() {
        const inkContentHeight = this.inkLayer.scrollHeight;
        const pageHeightPx = this._convertCssUnitToPx(this.options.pageHeight);
        const pageInsetPx = this._convertCssUnitToPx(this.options.pageInset);
        const pageGapPx = this._convertCssUnitToPx(this.options.pageGap);

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
        while (this.paperLayer.children.length > totalPages) {
            this.paperLayer.removeChild(this.paperLayer.lastChild);
        }

        // Add missing page cards
        while (this.paperLayer.children.length < totalPages) {
            const pageCard = document.createElement('div');
            pageCard.classList.add('pgntr-page-card');
            this.paperLayer.appendChild(pageCard);
        }

        // Store page boundaries for later use in pagination logic
        this.pageBoundaries = [];
        let currentY = 0; // Y-coordinate relative to the top of the ink layer
        for (let i = 0; i < totalPages; i++) {
            const pageTop = currentY + pageInsetPx;
            const pageBottom = currentY + pageHeightPx - pageInsetPx;
            this.pageBoundaries.push({ top: pageTop, bottom: pageBottom });
            currentY += pageHeightPx + pageGapPx;
        }
    }

    /**
     * Queries the ink layer for breakable elements and sorts them by document order.
     * @returns {HTMLElement[]} Array of breakable elements.
     * @private
     */
    _getBreakableElements() {
        const breakableElements = Array.from(this.inkLayer.querySelectorAll(this.options.breakableSelector));
        // Ensure the sentinel breakable exists and is included
        this._ensureSentinelBreakableExists();
        const sentinel = this.inkLayer.lastElementChild;
        if (sentinel && !breakableElements.includes(sentinel)) {
            breakableElements.push(sentinel);
        }
        // Sort by their position in the DOM
        breakableElements.sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
        return breakableElements;
    }

    /**
     * Processes breakable elements, inserting spacers where content overflows.
     * @private
     */
    _processBreakableElements() {
        const breakableElements = this._getBreakableElements();
        let currentPageIndex = 0;
        const pageHeightPx = this._convertCssUnitToPx(this.options.pageHeight);
        const pageInsetPx = this._convertCssUnitToPx(this.options.pageInset);
        const pageGapPx = this._convertCssUnitToPx(this.options.pageGap);

        // Get the bounding rectangle of the ink layer relative to the viewport
        const inkLayerRect = this.inkLayer.getBoundingClientRect();

        for (const element of breakableElements) {
            const elementRect = element.getBoundingClientRect();
            // Calculate element's top relative to the ink layer's content area start
            const elementTopInInkLayer = elementRect.top - inkLayerRect.top;

            // Find which page this element currently "thinks" it's on
            while (currentPageIndex < this.pageBoundaries.length - 1 &&
                   elementTopInInkLayer >= this.pageBoundaries[currentPageIndex].bottom) {
                currentPageIndex++;
            }

            const currentPageBottom = this.pageBoundaries[currentPageIndex].bottom;

            // Check for overflow
            if (elementTopInInkLayer + elementRect.height > currentPageBottom) {
                // This element overflows the current page. Insert a spacer before it.
                const spaceNeeded = (currentPageBottom - elementTopInInkLayer);
                this._insertPageBreakBeforeElement(element, spaceNeeded);
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
     * @private
     */
    _insertPageBreakBeforeElement(element, spaceNeeded) {
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
     * @private
     */
    _ensureSentinelBreakableExists() {
        const lastChild = this.inkLayer.lastElementChild;
        if (!lastChild || !lastChild.classList.contains('breakable') || lastChild.offsetHeight !== 0) {
            const sentinel = document.createElement('div');
            sentinel.classList.add('breakable');
            sentinel.style.height = '0';
            sentinel.style.overflow = 'hidden'; // Ensure it doesn't affect layout visually
            this.inkLayer.appendChild(sentinel);
        }
    }

    /**
     * Performs a secondary validation of spacer positions, triggered by scroll.
     * This handles edge cases where content shifts without changing total scrollHeight.
     * @private
     */
    _performSecondarySpacerValidation() {
        if (this.isUpdating) return;

        const pageHeightPx = this._convertCssUnitToPx(this.options.pageHeight);
        const pageInsetPx = this._convertCssUnitToPx(this.options.pageInset);
        const pageGapPx = this._convertCssUnitToPx(this.options.pageGap);
        const inkLayerRect = this.inkLayer.getBoundingClientRect();

        let needsUpdate = false;
        const spacers = Array.from(this.inkLayer.querySelectorAll('.pgntr-page-break-spacer'));

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
                for (let p = 0; p < this.pageBoundaries.length; p++) {
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
                if (Math.abs(currentElementTopRelativeToPage) > this.options.heightChangeThreshold) {
                    needsUpdate = true;
                    break;
                }
            }
        }

        if (needsUpdate) {
            console.log("Paginator: Secondary spacer validation triggered update.");
            this.updatePagination();
        }
        this.userHasScrolledRecently = false; // Reset after validation
    }

    /**
     * Converts a CSS unit value (e.g., "8.5in", "30px") to pixels.
     * @param {string} value - The CSS value string.
     * @returns {number} The value in pixels.
     * @private
     */
    _convertCssUnitToPx(value) {
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
     * @private
     */
    _debounce(func, delay, immediate = false) {
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

    /**
     * Cleans up the Paginator instance, disconnecting observers and removing listeners.
     * @public
     */
    destroy() {
        if (this.resizeObserverInk) this.resizeObserverInk.disconnect();
        if (this.resizeObserverContainer) this.resizeObserverContainer.disconnect();
        if (this.mutationObserverInk) this.mutationObserverInk.disconnect();

        window.removeEventListener('scroll', this._debounce); // Need to store reference to actual debounced function
        window.removeEventListener('beforeprint', this.updatePagination); // Need to store reference to actual bound function

        this._clearPaginationHelpers();
        console.log("Paginator: Instance destroyed.");
    }
}

// Automatic initialization (as described in documentation)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.paginator').forEach(element => {
        new Paginator(element);
    });
});
