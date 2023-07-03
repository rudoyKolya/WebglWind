export const fragment = `
precision mediump float;
varying vec4 vColor;
void main() {
    float r = 0.5;
    if (distance(gl_PointCoord, vec2(0.5)) > r) {
        discard;
    }
    gl_FragColor = vColor;
}
`
export const vertex = `
attribute vec2 position;
attribute vec4 color;
varying vec4 vColor;
void main() {
     gl_Position = vec4(position, 0.0, 1.0);
     gl_PointSize = 2.0;
     vColor = color;
}
`