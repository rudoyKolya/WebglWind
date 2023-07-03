attribute vec2 position;
attribute float a_Size;
void main() {
    gl_Position = vec4(position, 0.0, 1.0);
    gl_PointSize = a_Size;
}