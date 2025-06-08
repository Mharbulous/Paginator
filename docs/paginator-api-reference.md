# Paginator Component API Reference

| Metadata | Value                   |
|----------|-------------------------|
| Version  | 1.0                     |
| Date     | 2025-05-17              |
| Project  | Paginator Component MVP |

## Table of Contents
- [1. Overview](#1-overview)
- [2. Initialization](#2-initialization)
  - [2.1. Automatic Initialization (Recommended)](#21-automatic-initialization-recommended)
  - [2.2. Manual JavaScript Initialization](#22-manual-javascript-initialization)
- [3. Paginator Class API](#3-paginator-class-api)
  - [3.1. Constructor](#31-constructor)
  - [3.1.1. Constructor Options](#311-constructor-options)
  - [3.2. Public Methods](#32-public-methods)
  - [3.3. Custom Events](#33-custom-events)
- [4. Required HTML Structure (Recap)](#4-required-html-structure-recap)
- [5. Key CSS Classes for Developers (Behavioral)](#5-key-css-classes-for-developers-behavioral)

---

## 1. Overview
The **Paginator component** is a Vanilla JavaScript class designed to transform designated HTML content into a skeuomorphic, multi-page "digital paper" layout. It dynamically handles pagination in real-time as content changes. This document details its public API.

---

## 2. Initialization
There are two ways to initialize and use the Paginator component:

### 2.1. Automatic Initialization (Recommended)
-   **Include Files**:
    -   Link `paginator.css` in the `<head>`.
    -   Include `paginator.js` at the end of the `<body>` (ideally with `defer`).
-   **HTML Structure**: Add the class `paginator` to your main container `div`. This container must include three direct child `div` elements with the classes `.pgntr-paper-layer`, `.pgntr-ink-layer`, and `.pgntr-console-layer`.

    ```html
    <div class="paginator"
         data-page-inset="0.75in"
         data-page-gap="25px">
        <div class="pgntr-paper-layer"></div>
        <div class="pgntr-ink-layer">
            <!-- Your content goes here -->
        </div>
        <div class="pgntr-console-layer">
            <!-- UI controls can go here -->
        </div>
    </div>
    ```
-   **Activation**: The Paginator component will automatically find and initialize itself on any `div.paginator` element when the `DOMContentLoaded` event fires.
-   **Configuration**: Basic options can be passed via `data-*` attributes on the `div.paginator` element (see [Section 3.1.1 Constructor Options](#311-constructor-options)).

### 2.2. Manual JavaScript Initialization
For more control, you can instantiate the `Paginator` class manually:

```javascript
// Ensure Paginator class from paginator.js is loaded
document.addEventListener('DOMContentLoaded', () => {
    const paginatorElement = document.getElementById('myCustomPaginatorContainer');
    const options = {
        pageMargin: '1in',
        pageGap: '30px'
        // other options...
    };
    if (paginatorElement) {
        const paginatorInstance = new Paginator(paginatorElement, options);
        // paginatorInstance can be used to call public methods like .destroy()
    }
});
```

---

## 3. Paginator Class API
The core of the component is the `Paginator` class, found in `src/styles/paginator.js`.

### 3.1. Constructor
`new Paginator(containerElement, options?)`

Creates a new `Paginator` instance.

-   **Parameters**:
    -   `containerElement` (HTMLElement): **Required**. The main HTML DOM element that contains the Paginator structure (i.e., the element that would typically have the `.paginator` class for auto-initialization). This element *must* contain the three required layer divs (`.pgntr-paper-layer`, `.pgntr-ink-layer`, `.pgntr-console-layer`).
    -   `options` (Object): **Optional**. An object containing configuration options for the `Paginator` instance. These options override any `data-*` attributes if both are present.

### 3.1.1. Constructor Options
The `options` object can contain the following properties. Default values are used if an option is not provided via JavaScript or `data-*` attributes.

| Option              | data-* Attribute        | Type   | Default      | Description                                                                                                                               |
|---------------------|-------------------------|--------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| `pageWidth`         | `data-page-width`       | String | `"8.5in"`    | The physical width of a single page (e.g., `"8.5in"`, `"210mm"`).                                                                        |
| `pageHeight`        | `data-page-height`      | String | `"11in"`     | The physical height of a single page (e.g., `"11in"`, `"297mm"`).                                                                       |
| `pageMargin`        | `data-page-inset`      | String | `"0.5in"`    | The margin for all four sides of the page content area (e.g., `"0.5in"`, `"20mm"`).                                                         |
| `pageGap`           | `data-page-gap`         | String | `"30px"`     | The visual gap displayed between page cards in the on-screen view (e.g., `"20px"`, `"2em"`).                                              |
| `breakableSelector` | `data-breakable-selector` | String | `".breakable"` | A CSS selector string to identify elements where page breaks are allowed *before* them. Multiple selectors can be comma-separated.          |
| `debounceDelay`     | `data-debounce-delay`   | Number | `150`        | Debounce delay in milliseconds for `ResizeObserver` callbacks that trigger pagination updates.                                                |
| `logLevel`          | `data-log-level`        | String | `"warn"`     | Controls the level of console logging for warnings and errors from the Paginator. (e.g. `"error"`, `"info"`)                                |

> Internal CSS variables like `--pgntr-page-width-visual` are derived from these options.

### 3.2. Public Methods

#### `updatePagination()`
Manually triggers a full recalculation and re-rendering of the paginated layout. This is useful if content within the `.pgntr-ink-layer` is modified by external scripts in a way that might not be automatically detected by the Paginator's internal observers, or if a programmatic refresh is explicitly needed.

-   **Parameters**: None.
-   **Returns**: `void`.
-   **Example**:
    ```javascript
    // Assuming paginatorInstance is an instance of Paginator
    paginatorInstance.updatePagination();
    ```

#### `destroy()`
Cleans up the `Paginator` instance. This method should be called if the Paginator component needs to be removed from the page or reinitialized. It performs the following actions:

-   Disconnects all `ResizeObserver` and `MutationObserver` instances.
-   Removes any event listeners (e.g., scroll, print).
-   Removes all dynamically added helper elements by the Paginator (e.g., `.pgntr-page-break-spacer` elements from the ink layer, and `.pgntr-page-card` elements from the paper layer).

> The original user-provided HTML content within the `.pgntr-ink-layer` and `.pgntr-console-layer` remains untouched. The `.pgntr-paper-layer` will be empty after `destroy()`.

-   **Parameters**: None.
-   **Returns**: `void`.
-   **Example**:
    ```javascript
    // Assuming paginatorInstance is an instance of Paginator
    paginatorInstance.destroy();
    ```

### 3.3. Custom Events
For the MVP, the Paginator does not dispatch any custom JavaScript events. Future versions might include events like `paginator:updated` or `paginator:pageAdded`.

---

## 4. Required HTML Structure (Recap)
For Paginator to function correctly, the developer **must** provide the following HTML structure within the `containerElement` (or the element with `class="paginator"` for auto-init):

```html
<div class="paginator">
    <div class="pgntr-paper-layer">
        <!-- Visual page cards will be rendered here by Paginator.js -->
    </div>
    <div class="pgntr-ink-layer">
        <h1 class="breakable">My Title</h1>
        <p>Some content...</p>
        <!-- More user content -->
    </div>
    <div class="pgntr-console-layer">
        <!-- Optional UI controls can be placed here by the developer -->
    </div>
</div>
```
> Failure to provide these three layer divs will result in console errors/warnings and Paginator will not initialize correctly.

---

## 5. Key CSS Classes for Developers (Behavioral)
While `paginator.css` handles the core styling, developers use these CSS classes within their HTML (inside the `.pgntr-ink-layer`) to influence Paginator's behavior:

-   `.breakable`: Applied to an element to indicate that a page break is allowed *before* this element if it would otherwise overflow the current page.
-   `.screen-only`: Applied to an element that should be visible on screen but hidden during printing. Paginator's built-in `.pgntr-page-break-spacer` elements are automatically screen-only.
-   `.pgntr-print-only`: Applied to an element that should be hidden on screen but visible during printing.
    > (Note: `paginator-architecture.md` uses `.pgntr-print-only`. The `pgntr-` prefix is good for consistency.)
