# Story 1.3: Paginator Component JavaScript Initialization

## Status: To Do

## 1. User Story
(Derived from EPIC-001: Paginator Engine, US1.1)

As a developer, I want the Paginator component to automatically detect and initialize on elements with specific CSS classes, using sensible default page dimensions and margins, so that setup is minimal and provides a good cross-browser visual experience.

## 2. Acceptance Criteria (ACs)

1.  **AC1.1 (Auto-Initialization):** The Paginator component initializes automatically on DOM elements with the designated CSS class (`.paginator`) when the `DOMContentLoaded` event fires.
2.  **AC1.2 (JS Module/Class):** The core Paginator logic is encapsulated within a Vanilla JavaScript class named `Paginator` in a file named `paginator.js`.
3.  **AC1.3 (Layer Validation):** The Paginator's initialization logic, within its constructor or an internal setup method, correctly identifies the required direct child layer `div`s (`.pgntr-paper-layer`, `.pgntr-ink-layer`, `.pgntr-console-layer`) within the main `.paginator` container element.
4.  **AC1.4 (Console Warnings for Layers):** If any of the three required layer `div`s are missing or if there are duplicates within a given `.paginator` container, appropriate error or warning messages are logged to the browser console, and the Paginator does not attempt to complete initialization for that instance if critical layers are missing.
5.  **AC1.5 (Console Warning for No Paginator Elements):** If `paginator.js` is loaded but no elements with the `class="paginator"` are found in the DOM upon `DOMContentLoaded`, a warning message is logged to the browser console.
6.  **AC1.6 (Manual Initialization Option):** The `Paginator` class can be instantiated manually by a developer (e.g., `new Paginator(element, options)`), bypassing the automatic initialization routine.
7.  **AC1.7 (Basic Functionality Post-Init):** After successful initialization, the Paginator instance has identified its layers and applied the determined visual CSS variables to its container.
8.  **AC1.8 (Configuration of Visual Dimensions):**
    * The `Paginator` class uses the new global default pixel values for on-screen visual appearance: page width `892.5px`, page height `1155px`, and page margin `52.5px`.
    * These defaults can be overridden for a specific Paginator instance via `data-*` attributes (e.g., `data-page-width-visual-px="value"`) on the `.paginator` HTML element during auto-initialization, or by `options` passed to the constructor during manual initialization.
    * The Paginator sets the CSS custom properties (`--pgntr-page-width-visual`, `--pgntr-page-height-visual`, `--pgntr-page-margin`, and `--pgntr-page-gap`) on the instance's container element (`this.containerElement.style`) to reflect the final determined values.

## 3. Tasks / Subtasks

1.  **Task 1 (AC1.2): Create `src/paginator/paginator.js` and define the `Paginator` class structure.**
    * [ ] Create the file `src/paginator/paginator.js`.
    * [ ] Add `"use strict";` at the top of the file.
    * [ ] Define the basic `Paginator` class with a constructor: `constructor(containerElement, options = {})`.
    * [ ] Store `containerElement` on the instance.
    * [ ] Define default options within the class using the new universal pixel values:
        * `pageWidthVisualPx: 892.5`
        * `pageHeightVisualPx: 1155`
        * `pageMarginPx: 52.5`
        * `pageGapPx: 30` (or other existing default)
        * Other options like `breakableSelector`, `debounceDelay`, `logLevel`.
    * [ ] Merge provided `options` with these defaults and store on `this.options`.

2.  **Task 2 (AC1.3, AC1.7): Implement Layer Identification in Constructor.**
    * [ ] Within the `Paginator` constructor, call an internal method (e.g., `this._setupLayers()`).
    * [ ] Implement `_setupLayers()` to find and store references to `.pgntr-paper-layer`, `.pgntr-ink-layer`, `.pgntr-console-layer`.

3.  **Task 3 (AC1.4): Implement Layer Validation and Console Warnings in `_setupLayers()`.**
    * [ ] In `_setupLayers()`, validate the presence and uniqueness of each required layer, logging errors and halting instance initialization if invalid.

4.  **Task 4 (AC1.1, AC1.8): Implement Automatic Initialization Routine in `paginator.js`.**
    * [ ] Add a `DOMContentLoaded` listener outside the class.
    * [ ] Inside, query for `.paginator` elements.
    * [ ] For each, parse `data-*` attributes (e.g., `data-page-width-visual-px`, `data-page-height-visual-px`, `data-page-margin-px`, `data-page-gap-px`) as numbers (floats).
    * [ ] Instantiate `new Paginator(paginatorElement, optionsFromData)`, catching errors.

5.  **Task 5 (AC1.5): Implement Console Warning for No Paginator Elements Found.**
    * [ ] In the `DOMContentLoaded` listener, log a `console.warn` if no `.paginator` elements are found.

6.  **Task 6 (AC1.6): Ensure Manual Initialization Support.**
    * [ ] Confirm the `Paginator` class constructor processes passed `options` (pixel values for dimensions) correctly, merging them with defaults.

7.  **Task 7 (AC1.8): Apply Final Visual Dimensions as CSS Custom Properties.**
    * [ ] In the `Paginator` constructor, after options are finalized (from defaults, then data-attributes/constructor options):
        * [ ] Call an internal method like `this._applyVisualCssVariables()`.
    * [ ] Implement `_applyVisualCssVariables()`:
        * [ ] `this.containerElement.style.setProperty('--pgntr-page-width-visual', this.options.pageWidthVisualPx + 'px');`
        * [ ] `this.containerElement.style.setProperty('--pgntr-page-height-visual', this.options.pageHeightVisualPx + 'px');`
        * [ ] `this.containerElement.style.setProperty('--pgntr-page-margin', this.options.pageMarginPx + 'px');`
        * [ ] `this.containerElement.style.setProperty('--pgntr-page-gap', this.options.pageGapPx + 'px');`

8.  **Task 8 (ACs: All relevant): Update `demonstration.html` to Test Initialization.**
    * [ ] Link `src/paginator/paginator.js` in `demonstration.html`.
    * [ ] Test auto-initialization with and without `data-*` attributes overriding the new defaults.
    * [ ] Test manual instantiation, providing different pixel values in the `options` object.
    * [ ] Verify in dev tools that the CSS variables on the Paginator instance(s) correctly reflect the new defaults, or the `data-*` / JS option overrides.
    * [ ] Test console warnings by temporarily breaking the HTML structure.

9.  **Task 9 (External): Update `src/paginator/paginator.css` Default Values.**
    * [ ] Modify the `:root` definitions in `src/paginator/paginator.css` to use the new universal default dimensions:
        * `--pgntr-page-width-visual: 892.5;`
        * `--pgntr-page-height-visual: 1155;`
        * `--pgntr-page-margin: 52.5;`
        * (`--pgntr-page-gap` can remain e.g., `30;`)

## 4. Dev Technical Guidance

* **File Location:** `src/paginator/paginator.js`.
* **CSS Defaults Update:** The CSS file `src/paginator/paginator.css` should be updated (Task 9) to reflect these new base default dimensions in its `:root` block. The JavaScript `Paginator` class will also use these as its internal defaults, which can then be overridden per instance.
* **Configuration Options:**
    * `data-*` attributes and JavaScript `options` for visual dimensions (`pageWidthVisualPx`, `pageHeightVisualPx`, `pageMarginPx`, `pageGapPx`) should be treated as numbers representing pixels.
* **No Browser Detection:** All browser-specific calibration logic is removed.
* **Architecture & API Reference:** Consult relevant documents. The API reference regarding `data-*` attributes for dimensions might need slight clarification to emphasize pixel values if it currently implies units like "in". (The current `paginator-api-reference.md` implies string values like "8.5in" for `pageWidth`. This story implies pixel values for corresponding `data-page-width-visual-px` or that the JS class will handle conversion if "in" strings are used. For simplicity and alignment with Story 1.2, assuming pixel values for these specific JS options and data attributes is cleaner).

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