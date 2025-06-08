/**
 * _layers.js
 *
 * This file contains the method for identifying and validating Paginator layers.
 */

export function _setupLayers(containerElement, paginatorInstance) {
    const paperLayers = containerElement.querySelectorAll('.pgntr-paper-layer');
    const inkLayers = containerElement.querySelectorAll('.pgntr-ink-layer');
    const consoleLayers = containerElement.querySelectorAll('.pgntr-console-layer');

    if (paperLayers.length !== 1) {
        console.error("Paginator: Exactly one '.pgntr-paper-layer' is required inside the paginator container.");
    } else {
        paginatorInstance.paperLayer = paperLayers[0];
    }

    if (inkLayers.length !== 1) {
        console.error("Paginator: Exactly one '.pgntr-ink-layer' is required inside the paginator container.");
    } else {
        paginatorInstance.inkLayer = inkLayers[0];
    }

    if (consoleLayers.length !== 1) {
        console.error("Paginator: Exactly one '.pgntr-console-layer' is required inside the paginator container.");
    } else {
        paginatorInstance.consoleLayer = consoleLayers[0];
    }
}
