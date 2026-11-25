#version 300 es 
/**
File    rectangle.frag
brief   outputs the color of each rectangle fragment
*/

precision mediump float;

uniform vec4 uColor;
out vec4 fragColor; 

void main(){
    //output straight alpha RGBA w/o multiplying RGB by alpha
    fragColor = uColor;
}