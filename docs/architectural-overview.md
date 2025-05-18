# Paginator Technical Architecture

## 1. Introduction

This document outlines the technical architecture for the Paginator MVP, a Vanilla JavaScript front-end component. Paginator is designed to simplify the development of web applications requiring skeuomorphic "digital paper" interfaces (simulating 8.5x11 inch pages with defined margins) that feature dynamic, real-time pagination capabilities in response to content changes.

The architecture prioritizes a clear separation of concerns, a CSS-driven approach for layout and styling, and a robust JavaScript engine for managing the dynamic pagination logic.

## 2. Goals of the Architecture

The primary goals for this technical architecture are:

* **Modularity:** Design the Paginator as a self-contained JavaScript module (a `Paginator` class) that can be easily integrated into various web applications.
* **Vanilla JS & CSS Driven:** Adhere to the technical constraint of using only Vanilla JavaScript (no external JS frameworks/libraries for the component itself) and making the component primarily controllable and stylable via CSS classes.
* **Real-time Dynamic Updates:** Implement an efficient mechanism (primarily using `MutationObserver`) to monitor content changes within the designated "ink layer" and automatically recalculate/update the paginated layout in real-time.
* **Three-Layer Structure:** Clearly define and manage the three core visual and functional layers:
    * **Paper Layer:** Displays the visual representation of pages.
    * **Ink Layer:** Contains the actual document content that flows across pages.
    * **Console Layer:** A structurally-expected layer for UI controls, non-printable, and overlaid on other layers.
* **Skeuomorphic Page Representation:** Accurately simulate the visual appearance of physical 8.5x11 inch paper with configurable margins.
* **Developer-Friendly Integration:** Offer a simple integration path for developers, including automatic initialization based on CSS classes, and clear error reporting via the browser console for common setup issues.
* **Testability:** Structure the component and its outputs (particularly `demonstration.html`) to facilitate effective testing of its features.
* **Print Fidelity:** Ensure that the on-screen WYSIWYG representation translates accurately to printed output via robust `@media print` styling.
* **Leverage Prior Art:** Adapt and extend successful concepts from the previous "Two-Layer Paginator" where applicable (e.g., breakable unit logic, spacer concept).

## 3. Architectural Overview Diagram

The Paginator component operates on a target HTML container (identified by the `paginator` class for auto-initialization), transforming its content into a paginated view. It consists of a core JavaScript module and a set of CSS rules.

```mermaid
graph TD
    classDef default fill:#f9f9f9,stroke:#333,color:#333;
    classDef browserEnv fill:#e6e6fa,stroke:#333,color:#333;
    classDef domElement fill:#add8e6,stroke:#333,color:#00008b;
    classDef paginatorJS fill:#fffacd,stroke:#b8860b,color:#8b4513;
    classDef paginatorCSS fill:#d3d3d3,stroke:#696969,color:#000;
    classDef inkLayerStyle fill:#90ee90,stroke:#006400,color:#000;
    classDef dynamicElement fill:#ffebcd,stroke:#a0522d,color:#000;
    classDef logicBlock fill:#f0e68c,stroke:#daa520,color:#000;

    linkStyle default stroke:#FF00FF,stroke-width:2px;

    subgraph BrowserEnvironment ["Browser Environment"]
        DomHtml["HTML DOM"] 
        UserAppJS["User Application JS"]
        PaginatorJSFile["Paginator.js (Contains Paginator Class & Auto-Init Logic)"]
        PaginatorCSSFile["Paginator.css"]
    end

    UserAppJS -- "Optionally calls 'new Paginator()'" --> PaginatorJSFile
    PaginatorJSFile -- "Auto-init targets" --> PaginatorHtmlContainer

    subgraph DOMStructure ["HTML DOM Structure"]
        PaginatorHtmlContainer["{div class='paginator'} (Main HTML Container Element)"]
        PaperLayerHtml["{div class='pgntr-paper-layer'} (HTML Element)"]
        ConsoleLayerHtml["{div class='pgntr-console-layer'} (HTML Element)"]
        InkLayerHtml["{div class='pgntr-ink-layer'} (HTML Element, Content Source)"]
        
        PageCardsNode[".pgntr-page-card HTML elements (in Paper Layer)"]
        SpacersNode[".pgntr-page-break-spacer HTML elements (in Ink Layer)"]
    end
    
    PaginatorHtmlContainer --> PaperLayerHtml
    PaginatorHtmlContainer --> InkLayerHtml
    PaginatorHtmlContainer --> ConsoleLayerHtml

    PaginatorJSFile -- "JS instance manipulates" --> PaginatorHtmlContainer
    PaginatorJSFile -- "JS instance reads/observes" --> InkLayerHtml
    PaginatorJSFile -- "JS instance manages/creates" --> PaperLayerHtml
    PaginatorJSFile -- "JS instance dynamically creates" --> PageCardsNode
    PaginatorJSFile -- "JS instance dynamically creates" --> SpacersNode
    PaginatorCSSFile -- Styles --> PaginatorHtmlContainer
    PaginatorCSSFile -- Styles --> PaperLayerHtml
    PaginatorCSSFile -- Styles --> InkLayerHtml
    PaginatorCSSFile -- Styles --> ConsoleLayerHtml
    PaginatorCSSFile -- Styles --> PageCardsNode
    PaginatorCSSFile -- Styles --> SpacersNode

    InkLayerHtml -- Contains --> UserContent["User's HTML Content (.breakable, .screen-only, etc.)"]
    
    PaginatorJSFile -- "Code includes" --> MutationObserverLogic["MutationObserver Logic"]
    PaginatorJSFile -- "Code includes" --> PaginationEngineLogic["Pagination Engine Logic"]
    PaginationEngineLogic -- Triggers --> DOMManipulation["DOM Measurement & Manipulation"]
    
    class UserAppJS,PaginatorJSFile,PaginatorCSSFile browserEnv; 
    class DomHtml,PaginatorHtmlContainer,PaperLayerHtml,InkLayerHtml,ConsoleLayerHtml domElement; 
    class PaginatorJSFile paginatorJS;
    class PaginatorCSSFile paginatorCSS;
    class InkLayerHtml inkLayerStyle; 
    class PageCardsNode,SpacersNode,UserContent dynamicElement;
    class MutationObserverLogic,PaginationEngineLogic,DOMManipulation logicBlock;
```