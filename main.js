/**
File    main.js
brief   rennders 2 overlapping rectangles with configurable blending
*/

const canvas = document.getElementById("glCanvas");
const statusText = document.getElementById("status");
const controls = document.getElementById("controls");
const opacityA = document.getElementById("opacityA");
const opacityB = document.getElementById("opacityB");
const blendMode = document.getElementById("blendMode");
const reverseOrder = document.getElementById("reverseOrder");
const opacityAValue = document.getElementById("opacityAValue");
const opacityBValue = document.getElementById("opacityBValue");
const blendEquation = document.getElementById("blendEquation");
const blendFactors = document.getElementById("blendFactors");
const blendExplanation = document.getElementById("blendExplanation");

let gl;
let program;
let vertexArray;
let colorLocation;

/**
loadShader
loads GLSL source from shader file(s)
parameters: 
- path      relative shader file path
return: premise containingthe shader source string
*/
async function loadShader(path) {
    const response =await fetch(path);

    if(!response.ok) {
        throw new Error("Could not load shader: " + path);
    }

    return response.text();
}

/**
compileShader
compiles GLSL source and reports compiler errors
parameters: 
- type      WebGL shader type
- source    GLSL source strig
return: compiled shader object
*/
function compileShader(type, source){
    const shader= gl.createShader(type);

    if(!shader){
        throw new Error("could not create shader");
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        const log = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("Shader compilation failed: " +log);
    }
    return shader;
}

/**
createProgram
loads, compiles, and links the vertex and fragment shaders
return: contains linked shader program
*/
async function createProgram(){
    const vertexSource = await loadShader("./shaders/rectangle.vert");
    const fragmentSource = await loadShader("./shaders/rectangle.frag");

    const vertexShader =compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader =compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    const shaderProgram = gl.createProgram();

    if(!shaderProgram) {
        throw new Error("Could not create shader program");
    }

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    //individual shader objs are no longer needed after linking
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        const log = gl.getProgramInfoLog(shaderProgram);
        gl.deleteProgram(shaderProgram);
        throw new Error("shader linking failed: "+ log); 
    }
    return shaderProgram;
 }

/**
initGeometry
uploads rectnagle vertices and configures the position attribute
*/
function initGeometry() {
    const vertices = new Float32Array([
        //rectangleA: 6 vertices in normalized device coordinates
        -0.75, -0.25, 0.25, -0.25, 0.25, 0.75,
        -0.75, -0.25, 0.25, 0.75, -0.75, 0.75,

        //rectangleB: 6 vertices in normalized device coordinates
        -0.25, -0.75, 0.75, -0.75, 0.75, 0.25,
        -0.25, -0.75, 0.75, 0.25, -0.25, 0.25
    ]);

    vertexArray =gl.createVertexArray();
    const vertexBuffer= gl.createBuffer();

    if(!vertexArray ||!vertexBuffer) {
        throw new Error("could not create geometry resources");
    }

    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,vertices, gl.STATIC_DRAW);

    //Attribute location 0 reads 2 tightly packed floats per vertex
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

/**
configureBlending
sets the blending state and factors for the selected mode
 */
function configureBlending(){
    if(blendMode.value === "disabled"){
        gl.disable(gl.BLEND);
        return;
    }

    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);

    //both enabled modes use source alpha but differ in destination weighting
    if(blendMode.value === "additive"){
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    } else{
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }
}

/**
drawRectangle
sets the RGBA unifor&draws one rectangle
parameters:
- first     index of first vertex
- color     RGB color array
- opacity   alpha value(0-1)
*/
function drawRectangle(first, color, opacity) {
    gl.uniform4f(colorLocation, color[0], color[1], color[2], opacity);
    gl.drawArrays(gl.TRIANGLES, first, 6);
}

/**
 updateDisplay
 updates the opacity values and explains the selected RGB blending mode
 */
function updateDisplay(alphaA, alphaB){
    opacityAValue.textContent =alphaA.toFixed(2);
    opacityBValue.textContent =alphaB.toFixed(2);

    if(blendMode.value === "disabled"){
        blendEquation.textContent = "Cout = Cs";
        blendFactors.textContent= "BLEND disabled";
        blendExplanation.textContent= "Source RGB replaces destination RGB regardless of opacity.";
    } else if(blendMode.value ==="additive"){
        blendEquation.textContent = "Cout = Cs * As + Cd";
        blendFactors.textContent = "SRC_ALPHA, ONE(FUNC_ADD)";
        blendExplanation.textContent= "Source RGB is weighted by alpha and added to the destination. Reversing order gives the same theoretical RGB result.";
    } else {
        blendEquation.textContent = "Cout = Cs * As + Cd * (1 - As)";
        blendFactors.textContent = "SRC_ALPHA, ONE_MINUS_SRC_ALPHA(FUNC_ADD)";
        blendExplanation.textContent ="The incoming color is weighted by its opacity, and the existing color by one minus that opacity. Drawing order can change the overlap color.";
    }
}

/**
draw
clears the framebuffer and draws both rectangles in the selected order
*/
function draw() {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    configureBlending();
    gl.useProgram(program);
    gl.bindVertexArray(vertexArray);

    //read the slider values as numbers
    const alphaA = opacityA.valueAsNumber;
    const alphaB = opacityB.valueAsNumber;
    const red =[1.0, 0.0, 0.0];
    const blue =[0.0, 0.0, 1.0];

    //only change submission order, geometry and rectangle colors remain fixed
    if(reverseOrder.checked){
        drawRectangle(6, blue, alphaB);
        drawRectangle(0, red, alphaA);
    } else{
        drawRectangle(0, red, alphaA);
        drawRectangle(6, blue, alphaB);
    }

    gl.bindVertexArray(null);
    updateDisplay(alphaA, alphaB);
}

/**
init
initializes the rendering context, shader program, and geometry
 */
async function init(){
    //keep canvas opaque when composited onto the webpage
    gl =canvas.getContext("webgl2", {alpha: false});

    if(!gl){
        throw new Error("WebGL 2 is unavailable in this browser");
    }

    //wait for both shader files to load&the program to link
    program= await createProgram();
    colorLocation =gl.getUniformLocation(program, "uColor");

    if(colorLocation ===null){
        throw new Error("Could not locate the color uniform");
    }

    initGeometry();
    draw();

    const error = gl.getError();
    if(error!== gl.NO_ERROR){
        throw new Error("WebGL error: " + error);
    }

    //redraw on input changes instead of running a continuous rendering loop
    opacityA.addEventListener("input",draw);
    opacityB.addEventListener("input",draw);
    blendMode.addEventListener("change", draw);
    reverseOrder.addEventListener("change", draw);

    controls.disabled = false;
    statusText.textContent = "Renderer initialized";
}

//report intialization failures on webpage&in console
init().catch(error=> {
    statusText.textContent = "Renderer failed: "+ error.message;
    console.error(error);
});