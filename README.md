# Alpha Blending Visualizer
An interactive 2D graphics project exploring opacity, blending functions and rendering order using WebGL 2

# Current Features
- Independent opacity controls for 2 overlapping rectangles
- Standard alpha, additive and disabled blending modes
- Reversible drawing order
- Dynamic opacity values and blending equations

# Technologies
HTML, CSS, JavaScript, WebGL 2 and GLSL ES 300

# How to Run
https://nmiysfs.github.io/alpha-blending/
Requires a WebGL 2-compatible browser

Requires a WebGL 2-compatible browser 
No build system or external application libraries are required

# Implementation
Both rectangles share a vertex buffer, VAO and shader program
Straight-alpha RGBA values are submitted through a uniform, with blending performed by the GPU

Geometry and colours are fixed to focus on blending behaviour

# Development
Interactive alpha blending
See DEVELOPMENT.md for progress