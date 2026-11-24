/**
File    main.js
brief   initializes WebGL2 and draws 2 overlapping opaque rectangles
*/

const canvas = document.getElementById("glCanvas");
const statusText = document.getElementById("status");

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
draw
clears the framebuffer and draws both rectangles in a fixed order
*/
function draw() {
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.disable(gl.BLEND);
    gl.useProgram(program);
    gl.bindVertexArray(vertexArray);

    //draw rectangle A(red)
    gl.uniform3f(colorLocation, 1.0, 0.0, 0.0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);    
    //draw rectangle B(blue)
    gl.uniform3f(colorLocation, 0.0, 0.0, 1.0);
    gl.drawArrays(gl.TRIANGLES, 6, 6);

    gl.bindVertexArray(null);
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

    statusText.textContent = "test text";
}

//report intialization failures on webpage&in console
init().catch(error=> {
    statusText.textContent = "Renderer failed: "+ error.message;
    console.error(error);
});