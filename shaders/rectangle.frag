#version 300 es 
/**
File    rectangle.frag
brief   outputs the color of each rectangle fragment
*/

precision mediump float;

uniform vec3 uColor;
out vec4 fragColor; 

void main(){
    //use supplied RGB color with fully opaque alpha
    fragColor =vec4(uColor, 1.0);
}