# Data Models: Paginator MVP

| Metadata | Value                   |
|----------|-------------------------|
| Version  | 1.0                     |
| Date     | 2025-05-17              |
| Project  | Paginator Component MVP |

---

## 1. Introduction

This document describes the data handling and data model aspects of the **Paginator MVP component**. Understanding how **Paginator** interacts with data is *key to using it effectively*.

---

## 2. Primary Data Source: The DOM

The **Paginator component** is *fundamentally designed* to work directly with the **HTML Document Object Model (DOM)**.

*   **Ink Layer Content:** The primary "data" that **Paginator** processes is the *live HTML content* provided by the developer within the designated ``.pgntr-ink-layer`` element. **Paginator** reads the structure, content, and dimensions of these **DOM elements** to perform its layout and pagination calculations.
*   **No Semantic Interpretation:** **Paginator** does not parse or interpret the *semantic meaning* of the content within the ink layer (e.g., it doesn't understand that a particular string is a "date" or a "name" unless styled or structured in a way that affects its dimensions). Its concern is the *visual representation and flow* of these elements.

---

## 3. Configuration Data

The **Paginator component** accepts **configuration data** that *influences its behavior and appearance*:

*   **Constructor Options:** As detailed in the `` `paginator-api-reference.md` ``, an options object can be passed to the `` `Paginator` `` constructor (e.g., `` `pageWidth` ``, `` `pageMargin` ``, `` `breakableSelector` ``). These options are considered input data that *define the parameters for pagination*.
*   **`data-*` Attributes:** Equivalent configuration can also be provided via `` `data-*` `` attributes on the main **Paginator HTML container**.

These configuration values are used to set up internal parameters for the **pagination engine**.

---

## 4. Internal State Management

The **Paginator component** maintains a *minimal internal state necessary* for its operation. This state typically includes:

*   References to key **DOM elements** (e.g., the main container, paper layer, ink layer, console layer).
*   Calculated page boundaries and dimensions.
*   Flags to manage ongoing processes (e.g., `` `isUpdating` `` to prevent re-entrant updates).
*   References to observer instances (`` `ResizeObserver` ``, etc.).

This internal state is primarily focused on the *mechanics of the pagination process* and the visual layout, not on storing an abstract representation of the user's document content.

---

## 5. No Abstract Content Model

A key characteristic of the **Paginator MVP** is that **it does not create or maintain an internal, abstract JavaScript data model of the document content it paginates.**

*   **Direct DOM Operation:** **Paginator** reads from and writes to the **DOM** directly (e.g., inserting spacer elements, creating page card visuals).
*   **Stateless (Regarding Content):** It is largely stateless concerning the *semantic content* of the user's document. The **DOM** is the *single source of truth* for the content being paginated.
*   **Simplicity:** This approach contributes to the component's simplicity and aims to keep it lightweight, focusing on its *core responsibility* of dynamic layout and pagination.

---

## 6. Implications for Developers

*   **Content Management:** Developers are responsible for managing the content within the ``.pgntr-ink-layer`` using *standard DOM manipulation techniques* or their chosen JavaScript framework (if any, for the application *using* **Paginator**).
*   **Dynamic Updates:** When content is dynamically changed within the ``.pgntr-ink-layer``, **Paginator's** observers (primarily `` `ResizeObserver` ``) detect these changes (or changes to the container) and *trigger re-pagination*. For changes *not automatically detectable*, the public `` `updatePagination()` `` method can be called.
