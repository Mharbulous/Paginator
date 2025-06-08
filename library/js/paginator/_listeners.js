/**
 * _listeners.js
 *
 * This file contains methods for setting up scroll and print listeners.
 */

import { _debounce } from './_utils.js';

export function _setupListeners(paginatorInstance) {
    // Scroll Listener
    window.addEventListener('scroll', _debounce(() => {
        paginatorInstance.userHasScrolledRecently = true;
        paginatorInstance.lastScrollTime = Date.now();
        // Reset the flag after a timeout if no further scroll occurs
        setTimeout(() => {
            if (Date.now() - paginatorInstance.lastScrollTime >= paginatorInstance.options.scrollDebounceTime) {
                paginatorInstance.userHasScrolledRecently = false;
            }
        }, paginatorInstance.options.scrollDebounceTime + 50); // A little buffer
    }, 50, true)); // Use a very short debounce for scroll to update flag quickly

    // Print Listener
    window.addEventListener('beforeprint', () => {
        if (!paginatorInstance.isUpdating) {
            paginatorInstance.updatePagination();
        }
    });
}
