# Epic 1: **Paginator Engine** (Core CSS, Static & Dynamic Pagination Logic)

* **ID:** EPIC-001
* **Title:** **Paginator Engine** (Core CSS, Static & Dynamic Pagination Logic)
* **Project:** **Paginator** Component MVP
* **Date Created:** May 17, 2025
* **Last Updated:** May 17, 2025
* **Status:** Draft
* **Priority:** Critical
* **Related PRD:** `prd.md` (Revised May 17, 2025)

---

## 1. Goal
> Develop the core **Paginator** component, including its fundamental CSS structure for skeuomorphic page layout, the JavaScript logic for initializing and managing static content pagination, and the real-time dynamic update engine that adjusts pagination in response to content changes. This engine is the heart of the **Paginator**.

---

## 2. Scope & Features

### In Scope:
* **SF1.1: CSS Structure & Page Definition:**
    * CSS to define 8.5x11 inch page containers with configurable page-insets.
    * Implementation of the three-layer architecture (**Paper**, **Ink**, **Console**) via CSS classes, including `z-index` and basic pointer-event management.
* **SF1.2: JavaScript Initialization:**
    * Vanilla JavaScript module for **Paginator**.
    * Logic for automatic initialization based on the presence of designated **Paginator** CSS classes in the DOM.
* **SF1.3: Static Pagination Engine:**
    * Accurate DOM measurement of content height within the **Ink** layer of a page.
    * Detection of content overflow beyond the defined page boundaries.
    * Dynamic creation of new page containers when overflow is detected.
    * Logic for basic content flow across pages (e.g., simple block and inline elements).
    * Basic handling of breakable elements (e.g., paragraphs, list items to continue on next page).
    * Basic handling of unbreakable elements (e.g., attempt to move to next page if they don't fit, without splitting the element itself).
* **SF1.4: Dynamic Update Engine (Real-time Pagination):**
    * Mechanism to monitor designated content areas within the **Ink** layer for DOM changes (e.g., element additions, deletions, modifications – likely using `MutationObserver`).
    * Efficient recalculation of layout and pagination in real-time response to detected DOM changes.
    * Ensuring dynamic updates correctly trigger new page creation or removal as needed.
* **SF1.5: Core Print Styling:**
    * Basic `@media print` styles to ensure pages print cleanly, respecting the **Paginator's** page structure.
    * Ensure print output reflects the current state of dynamically paginated content.

### Out of Scope (for this Epic, may be in others or future):
* **OS1.1:** Specific interactive examples for demonstration (covered in EPIC-002).
* **OS1.2:** Application of **Paginator** to specific forms like BC Form 22 (covered in EPIC-003).
* **OS1.3:** Advanced error handling or UI for incorrect usage.
* **OS1.4:** Automatic scaling of oversized content.

---

## 3. User Stories

**US1.1 (Developer)**
:   As a developer, I want the **Paginator** component to automatically detect and initialize on elements with specific CSS classes, so that setup is minimal.

**US1.2 (Developer)**
:   As a developer, I want to apply CSS classes to define pages that simulate 8.5x11 inch paper with standard page-insets, so I can create skeuomorphic layouts.

**US1.3 (Developer)**
:   As a developer, I want content placed within a designated **Ink** layer to automatically flow across multiple rendered pages when it exceeds the height of a single page.

**US1.4 (Developer)**
:   As a developer, I want the **Paginator** engine to monitor content areas for dynamic changes (e.g., JS-driven additions/removals of elements) and automatically re-paginate the content in real-time.

**US1.5 (Developer)**
:   As a developer, I want basic block elements like paragraphs and list items to break naturally across pages if they cannot fit on a single page.

**US1.6 (Developer)**
:   As a developer, I want the **Paginator** to provide a basic three-layer structure (**Paper**, **Ink**, **Console**) controllable via CSS, so I can manage different types of page content.

**US1.7 (Developer)**
:   As a developer, I want the on-screen paginated layout to translate accurately to the print output, reflecting the current dynamic state.

---

## 4. Technical Considerations

* Must be implemented in Vanilla JavaScript (no external JS libraries).
* CSS should be efficient and clearly structured.
* Performance of DOM monitoring (`MutationObserver`) and layout recalculation is critical, especially with frequent or large content changes. Need to be mindful of reflows.
* Cross-browser consistency (Chrome, Firefox, Safari, Edge, Brave) for DOM measurements and CSS rendering is key.
* Leverage insights and algorithms from the "Two-Layer **Paginator**" where applicable.
* The engine must handle various HTML structures within the content areas.

---

## 5. Acceptance Criteria (High-Level)

**AC1.1**
:   **Paginator** initializes automatically on DOM elements with the designated CSS class.

**AC1.2**
:   CSS correctly renders page-like structures (8.5x11 size, page-insets) and supports **Paper**, **Ink**, **Console** layers.

**AC1.3**
:   Static content exceeding page height correctly flows onto subsequent dynamically created pages.

**AC1.4**
:   The dynamic update engine (e.g., using `MutationObserver`) successfully detects specified DOM changes within the **Ink** layer.

**AC1.5**
:   In response to detected DOM changes, the **Paginator** accurately and efficiently re-calculates page breaks and re-renders the paginated view in real-time.

**AC1.6**
:   Basic print styles ensure paginated output is clean and reflects the current on-screen view.

**AC1.7**
:   The core engine is testable via the `demonstration.html` file (developed in EPIC-002).

---

## 6. Dependencies
* PRD (`prd.md`)
* Relies on browser DOM APIs for measurement and manipulation.
* Will be tested and demonstrated via EPIC-002 (`demonstration.html`).
