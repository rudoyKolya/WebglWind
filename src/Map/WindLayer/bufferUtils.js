export const createBuffer = (gl) => {
    const positionLocation = gl.getAttribLocation(gl.program, 'position');
    const positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(positionLocation);
    const colorLocation = gl.getAttribLocation(gl.program, 'color');
    gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(colorLocation);
}