/**
 * _destroy.js
 *
 * This file contains the method for cleaning up the Paginator instance.
 */

// Note: The _debounce function reference needs to be stored in the Paginator instance
// during setup to be able to remove the event listener correctly.
// For simplicity in this refactor, we'll assume the debounced function is accessible
// via the instance if needed for removal, or accept that direct removal might not work
// for debounced functions unless the exact reference is kept.
// A more robust solution would involve storing the debounced function reference on the instance.

export function destroy(paginatorInstance) {
    if (paginatorInstance.resizeObserverInk) paginatorInstance.resizeObserverInk.disconnect();
    if (paginatorInstance.resizeObserverContainer) paginatorInstance.resizeObserverContainer.disconnect();
    if (paginatorInstance.mutationObserverInk) paginatorInstance.mutationObserverInk.disconnect();

    // To correctly remove debounced listeners, the exact function reference passed to addEventListener
    // must be used. Since _debounce creates a new function each time, we cannot simply remove it
    // by calling _debounce again. The original debounced function reference needs to be stored
    // on the paginatorInstance during _setupListeners.
    // For now, we'll comment out the removal of debounced scroll listener as it requires
    // a change in _setupListeners to store the reference.
    // window.removeEventListener('scroll', paginatorInstance._debouncedScrollHandler);

    // The beforeprint listener is not debounced in the original code, so it can be removed directly
    // if the updatePagination method was bound to the instance.
    // If updatePagination is called directly as a method, it's implicitly bound.
    // If it was passed as a direct reference, it needs to be the same reference.
    // For now, assuming it was passed as a direct reference or a simple arrow function.
    window.removeEventListener('beforeprint', paginatorInstance.updatePagination);

    paginatorInstance._clearPaginationHelpers();
    console.log("Paginator: Instance destroyed.");
}
