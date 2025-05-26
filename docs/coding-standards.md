# Coding Standards: Paginator MVP

| Metadata | Value |
|----------|-------|
| Version  | 1.2   |
| Date     | 2025-05-17 |
| Project  | Paginator Component MVP |

## 1. Introduction
These coding standards are established to ensure consistency, readability, and maintainability of the Paginator MVP codebase. Adherence to these standards is expected for all HTML, CSS, and JavaScript code written for the project. As the project is primarily developed by a single developer initially, these standards aim to be practical and support efficient development while laying a good foundation for potential future collaboration.

## 2. General Principles
*   **Readability**: Code should be written in a way that is easy for others (and your future self) to understand.
*   **Simplicity (KISS - Keep It Simple, Stupid)**: Prefer straightforward solutions over overly complex ones, especially for the MVP.
*   **Consistency**: Apply these standards consistently throughout the project.
*   **Comments**: Write clear and concise comments to explain complex logic, assumptions, or intentions where the code itself isn't self-explanatory.
*   **Tooling**: Utilize ESLint and Prettier (as configured for the project) to help enforce and automate many of these standards.
## 3. File Size and Modularity for AI-Assisted Development
To optimize the development process when utilizing AI coding tools and to ensure efficient processing and minimize potential issues, the following guidelines for file size should be observed, particularly for JavaScript and CSS files:

*   **Target File Size**: Aim for JavaScript and CSS files to be around 200 lines of code on average.
*   **Maximum File Size**: JavaScript and CSS files should ideally not exceed 300 lines of code.

### Rationale:
*   AI coding tools often process or rewrite entire files when making changes. Smaller files lead to significantly faster processing times.
*   Smaller file sizes reduce the risk of code truncation, misinterpretation, or context loss by AI tools, especially with large or complex changes.
*   Modular, focused files are generally easier to understand, test, and debug for both humans and AI.

### Strategy for JavaScript:
*   As a JavaScript file (e.g., `paginator.js` or its potential sub-modules if split in the future) approaches the 300-line limit, proactively identify logical sections or responsibilities within that file that can be extracted into new, smaller, focused files (e.g., 100-150 lines each).
*   These smaller files should be clearly named and organized within the project structure (e.g., within `src/paginator/modules/` if `paginator.js` itself is split).
*   Ensure clear import/export relationships if ES6 modules are used to connect these smaller files.

### Strategy for CSS:
*   Similarly, as a CSS file (e.g., `paginator.css`, or application-level stylesheets like `demo-styles.css`) approaches the 300-line limit, it should be split into smaller, more focused files based on component, utility, or feature (e.g., `buttons.css`, `tables.css`, `forms.css`, `layout.css`).
*   **Main Import File**: A common pattern is to have a primary CSS file (e.g., `styles.css` or `main.css` for an application, or even for structuring `paginator.css` if it becomes very large) that contains no actual style rules itself but only uses `@import` statements to include the smaller, more specific CSS files.
    ```css
    /* Example: src/demo/demo-styles.css */
    @import url('parts/demo-root-variables.css');
    @import url('parts/demo-layout.css');
    @import url('parts/demo-buttons.css');
    /* etc. */
    ```
*   This approach maintains modularity and makes it easier to manage and locate styles.

### Applicability:
*   This principle is critical for both JavaScript and CSS files due to their potential for logical complexity and length.
*   For HTML files, while they should also be kept focused on their specific purpose (e.g., one main component or view per file), their length is often more directly tied to the content structure. Splitting HTML might involve componentization strategies rather than arbitrary line limits, but the general idea of focused, manageable files still applies.
## 4. JavaScript Standards
These standards apply to all `.js` files, including `src/paginator/paginator.js` and any scripts for the demo or PoC.

### Strict Mode:
*   All JavaScript files should start with `"use strict";` to enable strict mode.

### Naming Conventions:
*   **Variables and Functions**: Use `camelCase` (e.g., `let pageCount;`, `function calculateHeight() {}`).
*   **Classes**: Use `PascalCase` (e.g., `class Paginator {}`).
*   **Methods**: Use `camelCase` (e.g., `myInstance.updatePagination()`).
*   **Private/Internal Methods/Properties (by convention)**: Prefix with an underscore `_camelCase` (e.g., `this._setupLayers()`, `this._isUpdating`).
*   **Constants**: Use `UPPER_SNAKE_CASE` for global or module-level constants (e.g., `const DEFAULT_MARGIN = '0.5in';`).
*   **DOM Element Variables**: Prefix with `$` if desired for quick identification (optional, e.g., `const $container = document.getElementById('app');`), or use descriptive names.

### Variables:
*   Use `const` by default for all variable declarations.
*   Use `let` only if the variable's value needs to be reassigned.
*   Avoid using `var`.

### Functions & Methods:
*   **Declaration**: For methods within classes, use standard method syntax. For standalone utility functions, function declarations are preferred for hoisting benefits if needed, otherwise, arrow functions assigned to `const` are also acceptable.
*   **Arrow Functions**: Use arrow functions for anonymous callback functions (e.g., event listeners, array methods) where lexical `this` binding is beneficial or `this` is not used.
*   **Parameters**: Clearly name parameters. If a function takes many optional parameters, consider using an options object.

### Classes:
*   The `Paginator` class should have a clear structure:
    *   `constructor`
    *   Public methods
    *   Internal/helper methods (prefixed with `_`)

### DOM Manipulation:
*   Cache DOM element selections in variables if they are accessed multiple times within a function's scope.
*   Minimize direct DOM manipulations in loops.

### Error Handling:
*   Use `try...catch` blocks for operations that might fail.
*   For developer errors (e.g., incorrect Paginator setup), use `console.error()` or `console.warn()` to provide clear messages.

### Comments:
*   **JSDoc-style Comments**: Use for documenting classes, methods (especially public ones), and complex functions. Include descriptions, `@param`, and `@returns` where appropriate.
    ```javascript
    /**
     * Calculates the total height of the content within the ink layer.
     * @param {HTMLElement} inkLayerElement - The ink layer DOM element.
     * @returns {number} The total height in pixels.
     */
    function calculateInkHeight(inkLayerElement) {
        // ... implementation
    }
    ```
*   **Inline Comments**: Use `//` for brief explanations of non-obvious code lines or blocks.

### Formatting:
*   **Indentation**: 4 spaces.
*   **Line Length**: Aim for a maximum of 100 characters per line (excluding comments or long strings if unavoidable).
*   **Semicolons**: Always use semicolons at the end of statements.
*   **Braces**:
    *   Opening braces (`{`) for blocks (classes, functions, if/else, loops) should be on the same line as the statement.
    *   Closing braces (`}`) should be on a new line, aligned with the block's starting indentation.
    ```javascript
    if (condition) {
        // code
    } else {
        // code
    }
    ```
*   **Spacing**: Use spaces around operators (`=`, `+`, `-`, `*`, `/`, `===`, etc.) and after commas.
## 5. CSS Standards
These standards apply to all `.css` files, including `src/paginator/paginator.css` and any demo/PoC specific stylesheets.

### Naming Conventions:
*   **Classes**: Use a consistent, hyphenated lowercase naming convention, prefixed with `pgntr-` for core Paginator component styles to avoid collisions and provide namespacing. Example: `pgntr-page-card`, `pgntr-ink-layer`, `pgntr-page-break-spacer`.
*   For modifiers or states, use a double hyphen (BEM-like): `pgntr-button--active`.
*   Avoid using ID selectors (`#myId`) for styling; prefer classes.
*   Avoid overly generic class names for application-specific styles (demo/PoC).

### Formatting:
*   **Indentation**: 4 spaces.
*   **Declaration Order**: Group related properties (e.g., positioning, box model, typography, visual).
*   **Properties**: One property declaration per line.
    ```css
    .pgntr-page-card {
        display: block;
        position: relative;
        width: var(--pgntr-page-width-visual);
        height: var(--pgntr-page-height-visual);
        background-color: white;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        box-sizing: border-box;
    }
    ```
*   **Spacing**: Include a space after the colon in property declarations (e.g., `display: block;`).
*   **Empty Lines**: Use empty lines to separate logical blocks of rules.

### Selectors:
*   Keep selector specificity as low as reasonably possible.
*   Avoid qualifying class names with type selectors unless necessary (e.g., prefer `.pgntr-button` over `div.pgntr-button`).

### Units:
*   Use `px` for fixed sizes like borders, and potentially for page dimensions.
*   Use `rem` for font sizes.
*   Use unitless numbers for `line-height` where appropriate.
*   Use `%` or viewport units (`vw`, `vh`) for fluid layouts where applicable.

### CSS Custom Properties (Variables):
*   Utilize for reusable values like colors, fonts, standard spacing, and key Paginator dimensions.
*   Prefix Paginator-specific custom properties with `--pgntr-` (e.g., `--pgntr-page-width-visual`).

### Comments:
*   Use `/* ... */` for comments.
*   Comment logical sections of your CSS.

### Modularity (reiterating from Section 3):
*   Prefer smaller, focused CSS files imported into a main stylesheet over monolithic CSS files, especially for application-level or complex component styles.
## 6. HTML Standards
These standards apply to `demonstration.html`, `bc-form-22.html`, and any other HTML structures.

*   **Document Type**: Use `<!DOCTYPE html>`.
*   **Language**: Specify the language: `<html lang="en">`.
*   **Character Encoding**: Specify UTF-8: `<meta charset="UTF-8">`.
*   **Semantics**: Use HTML5 semantic elements where appropriate.
*   **Formatting**:
    *   **Indentation**: 4 spaces.
    *   **Case**: Use lowercase for element names and attributes.
    *   **Quotes**: Use double quotes (`"`) for attribute values.
*   **Attributes**:
    *   Include `alt` attributes for all `<img>` tags.
    *   Ensure form inputs have associated `<label>` tags for accessibility.
    *   Boolean attributes should be written in their shorthand form (e.g., `<input type="checkbox" checked>`).
*   **Validation**: Aim for valid HTML.
*   **Comments**: Use `<!-- ... -->` to comment out sections or explain complex markup structures.
## 7. File Naming Conventions
*   **JavaScript**: `kebab-case.js` (e.g., `paginator.js`, `page-size-control-panel.js`)
*   **CSS**: `kebab-case.css` (e.g., `paginator.css`, `demo-styles.css`, `parts/buttons.css`)
*   **HTML**: `kebab-case.html` (e.g., `demonstration.html`, `bc-form-22.html`)
## 8. Version Control (Git)
*   **Commit Messages**: Follow the Conventional Commits specification.
    *   Examples:
        *   `feat: add real-time pagination update capability`
        *   `fix: correct spacer calculation for tall elements`
        *   `docs: update coding standards for CSS variables`
*   **Branching Strategy**: For solo development:
    *   `main`: Represents the stable, latest releasable code.
    *   Feature branches (e.g., `feat/add-table-support`): Create for new features or bug fixes, then merge into `main`.
