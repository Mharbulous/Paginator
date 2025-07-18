# Project Folder Structure: Paginator MVP

| Metadata | Value |
|----------|-------|
| Version  | 1.2   |
| Date     | 2025-05-19 |
| Project  | Paginator Component MVP |

## 1. Introduction
This document outlines the directory and file structure for the Paginator MVP project. The structure is designed to be logical, easy to navigate, and promote a clear separation of concerns. This organization will aid in development, maintenance, and comprehension by any contributor, including AI agents assisting with development.


## 2. Top-Level Directory Structure
The project root directory contains the following main files and directories:

```tree
Paginator/
├── .gitmodules
├── docs/
├── library/
├── modules/
├── src/
└── Tests/
```

`.gitmodules`: Configuration file for Git submodules.

`docs/`: Contains all project documentation, including requirements, architectural design, technical specifications, and this project structure document.

`library/`: Contains the core Paginator library files (CSS and JavaScript).

`modules/`: Contains various modules, including the BMAD method and FFM.

`src/`: Contains demonstration files and other non-library source code.

`Tests/`: Contains HTML files for testing the Paginator component in various scenarios and edge cases.


## 3. Library/ Directory Structure
The `library/` directory houses the core Paginator component's CSS and JavaScript files.

```tree
library/
├── js/
│   └── paginator.js
└── styles/
    ├── base.css
    ├── console.css
    ├── ink.css
    ├── paginator.css
    ├── paper.css
    ├── print-only.css
    ├── print.css
    └── screen-only.css
```

`library/js/`: Contains the core Paginator JavaScript file.
`paginator.js`: The main JavaScript file for the Paginator class.

`library/styles/`: Contains the core CSS files for the Paginator component.
`paginator.css`: The main CSS file, which imports all other Paginator-related styles.
`base.css`: Contains foundational CSS variables and base styles for the Paginator.
`console.css`: Contains styles for the Paginator's console/debug UI elements.
`ink.css`: Contains styles for the Paginator's content (ink) layer.
`paper.css`: Contains styles for the Paginator's visual page (paper) layer.
`print-only.css`: Styles applied only when printing.
`print.css`: General print styles.
`screen-only.css`: Styles applied only on screen.


## 4. modules/ Directory Structure
The `modules/` directory contains various sub-modules.

```tree
modules/
├── bmad-method/
└── FFM/
```

`bmad-method/`: Contains the BMAD method related files, including the BMAD agent configuration, personas, tasks, and templates.

`FFM/`: Contains the FFM (Fast Feedback Method) related files.

`bmad-method/`: Contains the BMAD method related files, including the BMAD agent configuration, personas, tasks, and templates.

`FFM/`: Contains the FFM (Fast Feedback Method) related files.


## 5. modules/bmad-method/ Directory Structure
The `modules/bmad-method/` directory contains the BMAD method implementation.

```tree
modules/bmad-method/
├── .git
├── .gitignore
├── build-web-agent.cfg.js
├── build-web-agent.js
├── README.md
├── web-build-sample.md
├── bmad-agent/
├── demos/
└── docs/
```

`bmad-agent/`: Contains BMAD agent configuration, personas, tasks, templates and other resources used by the AI workflow.

`demos/`: Contains demonstration files for the BMAD method.

`docs/`: Contains documentation specific to the BMAD method.


## 6. modules/bmad-method/bmad-agent/ Directory Structure
The `modules/bmad-method/bmad-agent/` directory stores BMAD agent configuration and resources.

```tree
modules/bmad-method/bmad-agent/
├── ide-bmad-orchestrator.cfg.md
├── ide-bmad-orchestrator.md
├── web-bmad-orchestrator-agent.cfg.md
├── web-bmad-orchestrator-agent.md
├── checklists/
├── data/
├── personas/
├── tasks/
└── templates/
```

`checklists/`: Contains various checklists used in the development process.

`data/`: Contains knowledge base and technical preferences data.

`personas/`: Contains definitions for different agent personas.

`tasks/`: Contains task definitions for the BMAD agent.

`templates/`: Contains document templates used by the agent personas.


## 7. docs/ Directory Structure
The `docs/` directory houses all project documentation.

```tree
docs/
├── Project Brief.md
├── prd.md
├── epics/
│   ├── epic-001-paginator-engine.md
│   ├── epic-002-demonstration-file.md
│   └── epic-003-bc-form-22-poc.md
├── stories/
│   ├── story-1.1.md
│   └── story-1.2.md
├── paginator-architecture.md
├── paginator-tech-stack.md
├── paginator-folder-structure.md  # This document
├── coding-standards.md
├── paginator-api-reference.md
├── paginator-data-models.md
├── paginator-environment-vars.md
├── paginator-testing-strategy.md
└── tutorial.md
```

`Project Brief.md`: Project brief document outlining the project's goals, scope, and requirements.

`prd.md`: Product requirements document detailing the product's specifications.

`epics/`: Subdirectory containing all epic definition files.

`stories/`: Subdirectory containing user story definitions.

`tutorial.md`: Tutorial documentation for using the paginator component.


## 8. src/ Directory Structure
The `src/` directory now primarily contains demonstration files and other non-library source code.

```tree
src/
└── demo/
    ├── demo-script.js
    └── demonstration.css
    └── demonstration.html
```

`src/demo/`: Contains the interactive demonstration files.

`demonstration.html`: The HTML file that uses and explains the Paginator.

`demonstration.css`: CSS specific to the demonstration's overall look and feel.

`demo-script.js`: JavaScript for interactive elements in the demonstration file.


## 9. Rationale for AI Agent Optimization
This project structure is designed to be easily parsable and navigable by AI agents:

Clear Separation of Concerns: Code (library, src), documentation (docs), and agent resources (modules/bmad-method/bmad-agent) are in distinct top-level directories or clearly defined subdirectories.

Modularity: The core paginator component's styles and scripts are isolated in the `library/` directory.

Descriptive Naming: Directory and file names clearly indicate their purpose.

Predictable Paths: Key files have straightforward, predictable paths.

Self-Contained Examples: The `src/demo/` directory groups all necessary files for the example, making it easy to understand and run independently.

This structure should facilitate tasks such as code generation, analysis, and modification by AI agents working on the project.
