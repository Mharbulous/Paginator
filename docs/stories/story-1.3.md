# Story 1.3: Paginator Component JavaScript Initialization & Visual Calibration

## Status: To Do

## 1. User Story
(Derived from EPIC-001: Paginator Engine, US1.1, and user request)

As a developer, I want the Paginator component to automatically detect and initialize on elements with specific CSS classes, so that setup is minimal. Furthermore, during initialization, I want the Paginator to apply minor, browser-specific visual adjustments to the on-screen skeuomorphic paper dimensions and margins by using predefined absolute pixel values for that browser to improve WYSIWYG accuracy, without affecting the print output.

## 2. Acceptance Criteria (ACs)

1.  **AC1.1 (Auto-Initialization):** The Paginator component initializes automatically on DOM elements with the designated CSS class (`.paginator`) when the `DOMContentLoaded` event fires.
2.  **AC1.2 (JS Module/Class):** The core Paginator logic is encapsulated within a Vanilla JavaScript class named `Paginator` in a file named `paginator.js`.
3.  **AC1.3 (Layer Validation):** The Paginator's initialization logic, within its constructor or an internal setup method, correctly identifies the required direct child layer `div`s (`.pgntr-paper-layer`, `.pgntr-ink-layer`, `.pgntr-console-layer`) within the main `.paginator` container element.
4.  **AC1.4 (Console Warnings for Layers):** If any of the three required layer `div`s (`.pgntr-paper-layer`, `.pgntr-ink-layer`, `.pgntr-console-layer`) are missing or if there are duplicates of any of them within a given `.paginator` container, appropriate error or warning messages are logged to the browser console, and the Paginator does not attempt to complete initialization for that instance if critical layers are missing.
5.  **AC1.5 (Console Warning for No Paginator Elements):** If `paginator.js` is loaded but no elements with the `class="paginator"` are found in the DOM upon `DOMContentLoaded`, a warning message is logged to the browser console.
6.  **AC1.6 (Manual Initialization Option):** The `Paginator` class can be instantiated manually by a developer (e.g., `new Paginator(element, options)`), bypassing the automatic initialization routine, allowing for more programmatic control.
7.  **AC1.7 (Basic Functionality Post-Init):** After successful initialization (either automatic or manual), the Paginator instance has successfully identified and stored references to its container element and its three layer elements.
8.  **AC1.8 (Data Attribute Configuration):** During automatic initialization, the Paginator reads and applies configuration options from `data-*` attributes present on the `.paginator` HTML element (e.g., `data-page-margin`, `data-page-gap`, as listed in `paginator-api-reference.md`). These values are expected to be numbers representing pixels for visual dimensions.
9.  **AC1.9 (Browser-Specific Visual Calibration):** Upon initialization, the Paginator attempts to identify the user's browser. If predefined absolute pixel values for page width, height, or margin exist for that browser in a calibration configuration, these absolute values are used to set the CSS custom properties (`--pgntr-page-width-visual`, `--pgntr-page-height-visual`, `--pgntr-page-margin`) for that Paginator instance's on-screen display. Otherwise, the standard values (from options/defaults) are used. These calibrations *only* affect the on-screen visual representation and do not alter print output styles. The initial implementation will include a structure for these calibrations with placeholder values.

## 3. Tasks / Subtasks

1.  **Task 1 (AC1.2): Create `src/paginator/paginator.js` and define the `Paginator` class structure.**
    * [ ] Create the file `src/paginator/paginator.js`.
    * [ ] Add `"use strict";` at the top of the file.
    * [ ] Define the basic `Paginator` class with a constructor: `constructor(containerElement, options = {})`.
    * [ ] Store `containerElement` on the instance.
    * [ ] Define default options within the class (e.g., for `pageWidthVisualPx`, `pageHeightVisualPx`, `pageMarginPx`, `pageGapPx`, `breakableSelector`, `debounceDelay`, `logLevel` - assuming pixel values for dimensions based on `paginator.css` and Story 1.2).
    * [ ] Merge provided `options` with defaults and store on `this.options`.

2.  **Task 2 (AC1.3, AC1.7): Implement Layer Identification in Constructor.**
    * [ ] Within the `Paginator` constructor, call an internal method (e.g., `this._setupLayers()`).
    * [ ] Implement `_setupLayers()`:
        * [ ] Query `this.containerElement` for direct children: `.pgntr-paper-layer`, `.pgntr-ink-layer`, `.pgntr-console-layer`.
        * [ ] Store references to these found layer elements on the instance (e.g., `this.paperLayer`, `this.inkLayer`, `this.consoleLayer`).

3.  **Task 3 (AC1.4): Implement Layer Validation and Console Warnings in `_setupLayers()`.**
    * [ ] In `_setupLayers()`, validate the presence and uniqueness of each required layer.
        * [ ] If `.pgntr-paper-layer` is not found or multiple are found, log a `console.error` and set an internal error flag or throw an error.
        * [ ] Repeat validation for `.pgntr-ink-layer` and `.pgntr-console-layer`.
    * [ ] The constructor should check this error status and exit gracefully if critical layers are invalid.

4.  **Task 4 (AC1.1, AC1.8): Implement Automatic Initialization Routine in `paginator.js`.**
    * [ ] Outside the `Paginator` class definition, add an event listener for `DOMContentLoaded`.
    * [ ] Inside the listener:
        * [ ] Query the DOM for all elements with `class="paginator"`.
        * [ ] For each found `paginatorElement`:
            * [ ] Create an `optionsFromData` object.
            * [ ] Read relevant `data-*` attributes (e.g., `data-page-width-visual-px`, `data-page-height-visual-px`, `data-page-margin-px`, `data-page-gap-px`, etc.) from `paginatorElement.dataset`. Parse numerical values as floats.
            * [ ] Instantiate `new Paginator(paginatorElement, optionsFromData)`.
            * [ ] Catch any errors from the constructor.

5.  **Task 5 (AC1.5): Implement Console Warning for No Paginator Elements Found.**
    * [ ] In the `DOMContentLoaded` listener, if no `.paginator` elements are found, log a `console.warn`.

6.  **Task 6 (AC1.6): Ensure Manual Initialization Support.**
    * [ ] Confirm the `Paginator` class constructor processes passed `options` correctly, merging them with defaults.

7.  **Task 7 (AC1.9): Implement Browser-Specific Visual Calibration Logic.**
    * [ ] In the `Paginator` constructor (e.g., after processing options and before calling `_updateVisualCssVariables()` or similar):
        * [ ] Implement a basic browser detection utility (e.g., `this._getBrowserName()`).
        * [ ] Define a static or instance-level configuration object (e.g., `Paginator.BROWSER_CALIBRATIONS` or `this.BROWSER_CALIBRATIONS`). Structure:
            ```javascript
            // const BROWSER_CALIBRATIONS = {
            //   firefox: { widthVisualPx: 812, heightVisualPx: 1052, marginPx: 47 },
            //   chrome: { widthVisualPx: 816, heightVisualPx: 1056, marginPx: 48 },
            //   // default values if needed, or rely on this.options if no browser match
            // };
            ```
        * [ ] Let `targetWidthVisualPx = this.options.pageWidthVisualPx;` (and similarly for height and margin).
        * [ ] Detect the current browser.
        * [ ] If a specific calibration entry exists for the detected browser in `BROWSER_CALIBRATIONS`:
            * [ ] `targetWidthVisualPx = BROWSER_CALIBRATIONS[browser].widthVisualPx;` (if defined, else keep from `this.options`)
            * [ ] `targetHeightVisualPx = BROWSER_CALIBRATIONS[browser].heightVisualPx;` (if defined)
            * [ ] `targetMarginPx = BROWSER_CALIBRATIONS[browser].marginPx;` (if defined)
        * [ ] Call an internal method `this._updateVisualCssVariables(targetWidthVisualPx, targetHeightVisualPx, targetMarginPx, this.options.pageGapPx)`.
    * [ ] Implement `_updateVisualCssVariables(width, height, margin, gap)`:
        * [ ] `this.containerElement.style.setProperty('--pgntr-page-width-visual', width + 'px');`
        * [ ] `this.containerElement.style.setProperty('--pgntr-page-height-visual', height + 'px');`
        * [ ] `this.containerElement.style.setProperty('--pgntr-page-margin', margin + 'px');`
        * [ ] `this.containerElement.style.setProperty('--pgntr-page-gap', gap + 'px');` (Gap is not typically browser-calibrated but set as part of visual variables).
    * [ ] Add prominent comments indicating `BROWSER_CALIBRATIONS` values are placeholders.

8.  **Task 8 (ACs: All relevant): Update `demonstration.html` to Test Initialization and Calibration.**
    * [ ] Link `src/paginator/paginator.js` in `demonstration.html`.
    * [ ] Add `data-page-margin-px="50"` etc. to the main Paginator container in `demonstration.html`.
    * [ ] Add a secondary Paginator structure for manual instantiation.
    * [ ] Add a script for manual instantiation with different options.
    * [ ] Test console warnings by temporarily breaking the HTML structure.
    * [ ] Verify in dev tools that the CSS variables on the Paginator instance(s) reflect:
        * `data-*` attributes if no JS options or calibration.
        * JS options if provided during manual init and no calibration.
        * `BROWSER_CALIBRATIONS` values if a (placeholder) entry for the current browser exists.

## 4. Dev Technical Guidance

* **File Location:** `src/paginator/paginator.js`.
* **Vanilla JavaScript:** ES6+ features.
* **Coding Standards:** `docs/coding-standards.md`.
* **DOM Interaction:** Standard methods.
* **Error Handling:** `console.error()` and `console.warn()`.
* **Configuration Options:**
    * Parse `data-*` attributes (e.g., `data-page-width-visual-px`, `data-page-margin-px`) as numbers (pixels).
    * Defaults for these should also be in pixels.
* **Browser Detection (Task 7):** Lightweight `navigator.userAgent` parsing for basic browser ID.
* **Visual Calibration (Task 7):**
    * The `BROWSER_CALIBRATIONS` object will contain *absolute pixel values*.
    * If a browser-specific entry is found, these absolute values are used to set the instance's visual CSS variables. Otherwise, values from `this.options` (derived from defaults, data-attrs, or constructor args) are used.
    * This calibration affects only on-screen display via CSS variables like `--pgntr-page-width-visual` applied to the instance, not the underlying print CSS.
* **Architecture & API Reference:** Consult relevant documents.
* **No Actual Pagination Yet:** Focus is on initialization, options, layer validation, and setting up CSS variables correctly, including any visual calibration.

## 5. Story DoD Checklist Report

*(To be completed by the Developer Agent)*

1.  **Requirements Met:**
    * [ ] All functional requirements specified in the story are implemented.
    * [ ] All acceptance criteria defined in the story are met.

2.  **Coding Standards & Project Structure:**
    * [ ] All new/modified code strictly adheres to `Operational Guidelines`.
    * [ ] All new/modified code aligns with `Project Structure`.
    * [ ] Adherence to `Tech Stack` for technologies/versions used.
    * [ ] Adherence to `Api Reference` and `Data Models` (if story involves API or data model changes).
    * [ ] Basic security best practices applied for new/modified code.
    * [ ] No new linter errors or warnings introduced.
    * [ ] Code is well-commented where necessary.

3.  **Testing:**
    * [ ] All required unit tests as per the story and `Operational Guidelines` Testing Strategy are implemented. (Manual/visual for MVP JS init)
    * [ ] All required integration tests (if applicable) as per the story and `Operational Guidelines` Testing Strategy are implemented. (Manual/visual for MVP JS init)
    * [ ] All tests (unit, integration, E2E if applicable) pass successfully. (Manual verification via `demonstration.html` and console)
    * [ ] Test coverage meets project standards (if defined).

4.  **Functionality & Verification:**
    * [ ] Functionality has been manually verified by the developer.
    * [ ] Edge cases and potential error conditions considered and handled gracefully.

5.  **Story Administration:**
    * [ ] All tasks within the story file are marked as complete.
    * [ ] Any clarifications or decisions made during development are documented in the story file or linked appropriately.
    * [ ] The story wrap up section has been completed with notes of changes or information relevant to the next story or overall project, the agent model that was primarily used during development, and the changelog of any changes is properly updated.

6.  **Dependencies, Build & Configuration:**
    * [ ] Project builds successfully without errors. (No build process)
    * [ ] Project linting passes (if linters are used).
    * [ ] Any new dependencies added were either pre-approved in the story requirements OR explicitly approved by the user during development. (No new dependencies expected)
    * [ ] If new dependencies were added, they are recorded in the appropriate project files.
    * [ ] No known security vulnerabilities introduced by newly added and approved dependencies.
    * [ ] If new environment variables or configurations were introduced by the story, they are documented and handled securely.

7.  **Documentation (If Applicable):**
    * [ ] Relevant inline code documentation (e.g., JSDoc) for new public APIs or complex logic is complete.
    * [ ] User-facing documentation updated, if changes impact users. (N/A for this story)
    * [ ] Technical documentation (e.g., READMEs, system diagrams) updated if significant architectural changes were made. (N/A for this story, aligns with existing architecture docs)

## Final Confirmation:
- [ ] I, the Developer Agent, confirm that all applicable items above have been addressed.