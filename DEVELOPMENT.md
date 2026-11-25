# Development Log

# DEV Log 1
## 25/11/2026 Basic 2D Renderer
Establish a working WebGL 2 renderer before introducing configurable blending
Current progress picture(s) can be seen under "/Development/Base"

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

# DEV Log 2
## 25/11/2026 alpha blending and interaction
Demonstrates how opacity, blending states, and drawing order affect overlapping fragment colors
Current progress picture(s) can be seen under the folder "/Development/Blending"

## Implementation and Decisions, Changes
- extended the RGB uniform to straight-alpha RGBA
- added independent opacity sliders and draw-order controls
- Configured 3 rendering modes using GPU blending states
- Reused existing geometry, VAO, VBO, and shader program
- Extracted rectangle drawing to prevent repeated draw logic
- Used input-driven renering
- Disabled controls untilinitialization completes

## Testing
- Verified independent opacity controls and draw order
- Verified all 3 blending modes