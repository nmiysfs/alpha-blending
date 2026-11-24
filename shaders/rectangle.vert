#version 300 es
/**
File    rectangle.vert
brief   processes rectangle vertex positions
*/

layout(location =0) in vec2 aPosition;

void main(){
    //input pos aeree already in normalized device coordinates
    gl_Position =vec4(aPosition, 0.0, 1.0);
}