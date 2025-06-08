# Paginator Library Usage

This README provides instructions on how to use the Paginator library's core components and the debugging stylesheet.


## 1. Setting up Paginator Classes and Properties

The Paginator library uses a layered approach with specific CSS classes and properties to control content flow and appearance across pages.

### Core Layers:

*   **Paper Layer (`.pgntr-paper-layer`)**:
    This class is typically applied to the main container that represents a "page" or a printable area. It defines the overall dimensions, page-insets, and background for each page.

    Example:
    ```html
    <div class="pgntr-paper-layer">
        <!-- Page content goes here -->
    </div>
    ```

*   **Ink Layer (`.pgntr-ink-layer`)**:
    This class is applied to content within the paper layer. It often defines padding and other styles that affect the "ink" (content) area within the page page-insets.

    Example:
    ```html
    <div class="pgntr-paper-layer">
        <div class="pgntr-ink-layer">
            <h1>My Document</h1>
            <p>This is some content on the page.</p>
        </div>
    </div>
    ```

*   **Console Layer (`.pgntr-console-layer`)**:
    This layer is typically used for elements that should appear outside the main paginated content, often for debugging or meta-information. Its exact styling and purpose depend on the specific implementation.

### Key Properties and Classes:

*   **Breakable Property (`.pgntr-breakable`)**:
    Apply this class to elements that are allowed to break across page boundaries. The Paginator engine will attempt to break these elements if they exceed the available space on a page.

    Example:
    ```html
    <div class="pgntr-breakable">
        This content can be split across pages.
    </div>
    ```

*   **Print Property (`.pgntr-print-only`)**:
    Elements with this class will only be visible when the document is printed (or in print preview mode). They are hidden in screen view.

    Example:
    ```html
    <p class="pgntr-print-only">This text only appears on printed pages.</p>
    ```

*   **Screen Only Property (`.pgntr-screen-only`)**:
    Elements with this class will only be visible when viewed on a screen (e.g., in a web browser). They are hidden when the document is printed.

    Example:
    ```html
    <button class="pgntr-screen-only">Print Document</button>
    ```

*   **Page Break Spacer (`.pgntr-page-break-spacer`)**:
    This class is used internally by the Paginator engine to insert visual or structural spacing where page breaks occur. By default, it's designed to be non-visible, but `pgntr-debug.css` can be used to visualize it.

    Example (inserted by Paginator.js):
    ```html
    <div class="pgntr-page-break-spacer"></div>
    ```

By combining these classes and understanding their purpose, you can effectively structure your HTML content for pagination using the Paginator library.

## 2. Using `pgntr-debug.css`

The `pgntr-debug.css` file is a utility stylesheet designed to help visualize the internal workings of the Paginator library, specifically the `pgntr-page-break-spacer` elements.

**To activate debugging visuals:**

1.  Ensure `pgntr-debug.css` is present in the `library/styles/` directory.
2.  Link this stylesheet in your HTML file's `<head>` section. For example, if your HTML file is in `src/demo/`, the path would be:

    ```html
    <link rel="stylesheet" href="../../library/styles/pgntr-debug.css">
    ```

When `pgntr-debug.css` is imported, elements with the class `pgntr-page-break-spacer` will have a visible dashed red border, a light red background, and a minimum height, making them easy to identify and inspect during development.

**To deactivate debugging visuals:**

Simply remove or comment out the `<link>` tag for `pgntr-debug.css` from your HTML file. The `pgntr-page-break-spacer` elements will revert to their default, non-visible state as defined by the core Paginator styles.

