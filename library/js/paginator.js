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

import { _parseOptions } from './paginator/_options.js'; // Handles parsing and managing Paginator options.
import { _setupLayers } from './paginator/_layers.js'; // Identifies and validates Paginator layers.
import { _setupObservers } from './paginator/_observers.js'; // Sets up ResizeObservers and MutationObserver.
import { _setupListeners } from './paginator/_listeners.js'; // Sets up scroll and print listeners.
import { _clearPaginationHelpers, _calculateAndRenderPageCards, _processBreakableElements, _ensureSentinelBreakableExists } from './paginator/_pagination-core.js'; // Contains core pagination logic for rendering pages and handling breakable elements.
import { _performSecondarySpacerValidation } from './paginator/_pagination-validation.js'; // Performs secondary validation of spacer positions.
import { destroy } from './paginator/_destroy.js'; // Cleans up the Paginator instance.

class Paginator {
    constructor(containerElement, options = {}) {
        if (!(containerElement instanceof HTMLElement)) {
            console.error("Paginator: Invalid container element provided. Must be an HTMLElement.");
            return;
        }

        this.containerElement = containerElement;
        this.options = _parseOptions(this.containerElement, options);

        this.paperLayer = null;
        this.inkLayer = null;
        this.consoleLayer = null;

        this.isUpdating = false;
        this.userHasScrolledRecently = false;
        this.lastScrollTime = 0;

        this.resizeObserverInk = null;
        this.resizeObserverContainer = null;
        this.mutationObserverInk = null;

        _setupLayers(this.containerElement, this);
        if (!this.paperLayer || !this.inkLayer || !this.consoleLayer) {
            console.error("Paginator: Required layers not found or duplicated. Initialization aborted.");
            return;
        }

        _setupObservers(this);
        _setupListeners(this);
        _ensureSentinelBreakableExists(this);
        this.updatePagination(); // Initial pagination
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

        _clearPaginationHelpers(this);
        _calculateAndRenderPageCards(this);
        _processBreakableElements(this);

        this.isUpdating = false;
        console.log("Paginator: Pagination update complete.");
    }

    /**
     * Cleans up the Paginator instance, disconnecting observers and removing listeners.
     * @public
     */
    destroy() {
        destroy(this);
    }

    // Expose private methods for internal use within the class, if needed by observers/listeners
    // This is a common pattern when refactoring class methods into external functions
    _performSecondarySpacerValidation() {
        _performSecondarySpacerValidation(this);
    }
}

// Automatic initialization (as described in documentation)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.paginator').forEach(element => {
        new Paginator(element);
    });
});
