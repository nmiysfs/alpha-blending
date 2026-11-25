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
## 25/11/2026 Alpha blending and interaction
Demonstrates how opacity, blending states, and drawing order affect overlapping fragment colors
Current progress picture(s) can be seen under the folder "/Development/Blending"

## Implementation and Decisions, Changes
- Extended the RGB uniform to straight-alpha RGBA
- Added independent opacity sliders and draw-order controls
- Configured 3 rendering modes using GPU blending states
- Reused existing geometry, VAO, VBO, and shader program
- Extracted rectangle drawing to prevent repeated draw logic
- Used input-driven renering
- Disabled controls untilinitialization completes

## Testing
- Verified independent opacity controls and draw order
- Verified all 3 blending modes

# DEV Log 3
## 25/11/2026 Final validation
Complete the educational interface and validate the application for browser deployment

## Implementation and Decisions, Changes
- Added numerical opacity displays(real-time)
- Added dynamic RGB blending equations and blend factors
- Explained source colour, destination colour and source alpha
- Reused the existing draw function to synchronize the interface

## Limitations
- Fixed rectangle geometry, colours and background
- Requires WebGL 2 support
- No context-loss recovery or dynamic drawing buffer resizing

## Testing
- Verified opacity displays and blending equation updates
- Confirmed existing blending and drawing order behaviour
- Verified canvas proportions and interface readability
- No relevant browser-console errors during operation

# DEV notes
How to run
(for dev)
1. Open the project folder in VS Code
2. Install the Live Server extension(Name: Live Server
Id: ritwickdey.LiveServer
Description: Launch a development local Server with live reload feature for static & dynamic pages
Version: 5.7.10
Publisher: Ritwick Dey
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
3. Right-click index.html and select Open with Live Server/Integrated Browser