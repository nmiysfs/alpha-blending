# Development Log

## 25/11/2026 Basic 2D Renderer
Establish a working WebGL 2 renderer before introducing configurable blending

## Constraints
- Browser-compatible, with no external application libraries

## Implementation and Decisions
- One VBO, VAO and shader program shared by both rectangles
- Direct normalized device coordinates to avoid matrices
- Two draw calls with separate RGB uniform values
- Fixed alpha of 1.0 with blending disabled
- Separate shader files for readability and GLSL highlighting
- Asynchronous shader loading through fetch()

## Issues and Changes
NIL

## Outcome
Initial renderer implemented