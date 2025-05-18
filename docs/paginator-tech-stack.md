# Technology Stack: Paginator MVP

**Version:** 1.0  
**Date:** 2025-05-17  
**Project:** Paginator Component MVP

## 1. Introduction

This document outlines the specific technologies and versions that will be used for the development and operation of the Paginator MVP component, the `demonstration.html` file, and the BC Form 22 Proof-of-Concept (PoC). The technology choices prioritize the project's core requirements, including the use of Vanilla JavaScript, a CSS-driven approach, and compatibility with modern desktop browsers.

## 2. Core Component Technologies (Paginator)

The Paginator component itself will be built using fundamental web technologies without reliance on external JavaScript frameworks or libraries.

* **Programming Language:**
    * **Vanilla JavaScript (ECMAScript 2015 / ES6 and newer features as supported by target browsers):**
        * **Specific Version:** ES6 serves as a baseline. Modern features such as Classes, Modules (implicit if `Paginator.js` is treated as a self-contained module to be included via `<script>`), `const`/`let`, Arrow Functions, Template Literals, Promises (if applicable for any async operations), `ResizeObserver`, and `MutationObserver` (though `ResizeObserver` is the primary one detailed in `paginator-architecture.md` for height changes) will be utilized. Code will be written to be directly executable in the target browsers without a separate transpilation step for the MVP.

* **Styling:**
    * **CSS3 (Cascading Style Sheets Level 3):**
        * **Specific Version:** Leveraging modern CSS3 features, including CSS Custom Properties (Variables) for theming and configuration (e.g., page dimensions, margins), Flexbox and/or Grid for layout within the component's structure if needed, and advanced selectors.

* **Markup (for component structure consumed and generated):**
    * **HTML5:**
        * **Specific Version:** Standard semantic HTML5 elements will be used by the consuming application, and the Paginator component will interact with and generate standard HTML5 elements (e.g., `div`s for page cards and spacers).

## 3. Demonstration File and Proof-of-Concept (PoC)

The `demonstration.html` file and the BC Form 22 PoC will utilize the same core technologies as the Paginator component, as they are direct consumers and showcases of it.

* **Markup:** HTML5
* **Styling:** CSS3 (including `paginator.css` and potentially application-specific styles)
* **Scripting:** Vanilla JavaScript (for interactive examples demonstrating Paginator's dynamic capabilities, and for integrating the Paginator component itself)

## 4. Development Environment & Tooling

While the Paginator component itself has no runtime dependencies on build tools, the following tools will be essential for development, testing, and version control:

* **Version Control:**
    * **Git:** For source code management. Specific version control platform (e.g., GitHub, GitLab) is up to the developer.

* **Integrated Development Environment (IDE):**
    * **Visual Studio Code (VS Code):** The primary IDE for development.

* **Web Browsers (for Development & Testing):**
    * Utilizing the built-in Developer Tools of the target browsers for debugging, performance profiling, and DOM inspection.

* **Local Development Server:**
    * **VS Code Live Server extension:** This extension will be used to serve the `demonstration.html`, PoC, and other development files locally. It facilitates rapid testing across different browsers and provides features like live reloading.
    * *Alternative simple HTTP servers (e.g., `npx http-server`, Python's `http.server`) can also be used if needed, but Live Server is the preferred tool for this project.*

* **Code Quality & Formatting (Recommended):**
    * **ESLint:** (To be configured) For identifying and reporting on patterns in JavaScript, ensuring code quality.
    * **Prettier:** (To be configured) For automatic code formatting to maintain a consistent style.

## 5. Target Browser Environments

The Paginator component, `demonstration.html`, and BC Form 22 PoC are required to be compatible with the latest stable versions of the following desktop web browsers (as per PRD IS6):

* **Google Chrome** (Latest version)
* **Mozilla Firefox** (Latest version)
* **Apple Safari** (Latest version)
* **Microsoft Edge** (Latest Chromium-based version)
* **Brave Browser** (Latest version)

No support for mobile browsers or older desktop browser versions is required for the MVP.

## 6. Excluded Technologies

For clarity, the following are explicitly out of scope for the Paginator MVP's technology stack:

* **JavaScript Frameworks/Libraries for Paginator Core:** No jQuery, React, Vue, Angular, etc., for the Paginator component itself.
* **CSS Preprocessors (for Paginator Core):** No Sass, Less, etc. The component will use plain CSS3.
* **Transpilers (for Paginator Core):** No Babel or similar for the MVP, assuming target browsers adequately support the chosen ES features.
* **Backend Technologies:** No server-side languages (Node.js, Python, PHP, etc.), databases, or server infrastructure, as Paginator is a purely client-side component.
* **Build Tools (as a runtime dependency):** No Webpack, Rollup, Parcel, etc., required to *use* the Paginator MVP. The `paginator.js` and `paginator.css` files are intended to be directly usable.
