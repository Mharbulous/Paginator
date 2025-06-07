"use strict";

/**
 * Updates the dimension, margin, and browser information displays in the console.
 */
function updateConsoleDisplays() {
    // Update Page Dimensions
    const pageCard = document.querySelector('.pgntr-page-card');
    const dimensionDisplay = document.getElementById('dmoDimensionDisplay');
    if (pageCard && dimensionDisplay) {
        const computedStyle = getComputedStyle(pageCard);
        // GetComputedStyle returns values like "816px". We need to parse the float.
        const width = parseFloat(computedStyle.width);
        const height = parseFloat(computedStyle.height);

        if (!isNaN(width) && !isNaN(height)) {
            dimensionDisplay.textContent = `${width.toFixed(2)}px x ${height.toFixed(2)}px`;
        } else {
            dimensionDisplay.textContent = 'Dimensions: N/A';
            console.warn('Paginator Dev: Could not parse page card dimensions for display.');
        }
    } else {
        if (!pageCard) {
            console.warn('Paginator Dev: .pgntr-page-card element not found for dimension display.');
        }
        if (!dimensionDisplay) {
            console.warn('Paginator Dev: #dmoDimensionDisplay element not found.');
        }
    }

    // Update Margin Display
    const marginDisplay = document.getElementById('dmoMarginDisplay');
    if (marginDisplay) {
        const currentMargin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pgntr-page-margin'));
        if (!isNaN(currentMargin)) {
            marginDisplay.textContent = `margin: ${currentMargin.toFixed(2)}px`;
        } else {
            marginDisplay.textContent = 'margin: N/A';
            console.warn('Paginator Dev: Could not parse --pgntr-page-margin for display.');
        }
    } else {
        console.warn('Paginator Dev: #pgntrMarginDisplay element not found.');
    }
}

/**
 * Handles the logic for increasing the size of page elements.
 */
function increasePageSize() {
    const rootStyle = document.documentElement.style;
    const currentWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pgntr-page-width-visual'));
    const currentHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pgntr-page-height-visual'));
    const currentMargin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pgntr-page-margin'));

    if (!isNaN(currentWidth) && !isNaN(currentHeight) && !isNaN(currentMargin)) {
        rootStyle.setProperty('--pgntr-page-width-visual', currentWidth * 1.01);
        rootStyle.setProperty('--pgntr-page-height-visual', currentHeight * 1.01);
        rootStyle.setProperty('--pgntr-page-margin', currentMargin * 1.01);
        updateConsoleDisplays();
    } else {
        console.warn('Paginator Dev: Could not parse current page dimensions or margin for increase from CSS variables.');
    }
}

/**
 * Handles the logic for decreasing the size of page elements.
 */
function decreasePageSize() {
    const rootStyle = document.documentElement.style;
    const currentWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pgntr-page-width-visual'));
    const currentHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pgntr-page-height-visual'));
    const currentMargin = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pgntr-page-margin'));

    if (!isNaN(currentWidth) && !isNaN(currentHeight) && !isNaN(currentMargin)) {
        rootStyle.setProperty('--pgntr-page-width-visual', currentWidth * 0.99);
        rootStyle.setProperty('--pgntr-page-height-visual', currentHeight * 0.99);
        rootStyle.setProperty('--pgntr-page-margin', currentMargin * 0.99);
        updateConsoleDisplays();
    } else {
        console.warn('Paginator Dev: Could not parse current page dimensions or margin for decrease from CSS variables.');
    }
}

/**
 * Attempts to identify the browser name and version from navigator.userAgent.
 * @returns {string} Browser name and version, or "Unknown Browser".
 */
function getBrowserInfo() {
    const ua = navigator.userAgent;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let tem;
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge?)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('Edg ', 'Edge ');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
}

/**
 * Updates the browser information display in the console.
 */
function updateBrowserInfoDisplay() {
    const browserInfoDisplay = document.getElementById('dmoBrowserInfoDisplay');
    if (browserInfoDisplay) {
        browserInfoDisplay.textContent = getBrowserInfo();
    } else {
        console.warn('Paginator Dev: #dmoBrowserInfoDisplay element not found.');
    }
}


// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    updateConsoleDisplays();
    updateBrowserInfoDisplay();

    const increaseButton = document.getElementById('dmoIncreaseSizeBtn');
    if (increaseButton) {
        increaseButton.addEventListener('click', increasePageSize);
    } else {
        console.warn('Paginator Dev: #dmoIncreaseSizeBtn element not found.');
    }

    const decreaseButton = document.getElementById('dmoDecreaseSizeBtn');
    if (decreaseButton) {
        decreaseButton.addEventListener('click', decreasePageSize);
    } else {
        console.warn('Paginator Dev: #dmoDecreaseSizeBtn element not found.');
    }
});
