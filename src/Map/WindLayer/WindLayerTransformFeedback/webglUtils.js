import {BUFFER_SIZE} from "./consts";
import {normalizeLongitude, normalizeValue} from "./utils";

export const createBufferWithVao = (gl, count, particles) => {
    const buffer = gl.createBuffer();
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, BUFFER_SIZE * count * 4, gl.DYNAMIC_COPY);
    particles && gl.bufferSubData(gl.ARRAY_BUFFER, 0, particles);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, BUFFER_SIZE * 4, 0);
    gl.vertexAttribPointer(1, 1, gl.FLOAT, false, BUFFER_SIZE * 4, 4);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, BUFFER_SIZE * 4, 8);
    gl.vertexAttribPointer(3, 3, gl.FLOAT, false, BUFFER_SIZE * 4, 12);
    gl.enableVertexAttribArray(0);
    gl.enableVertexAttribArray(1);
    gl.enableVertexAttribArray(2);
    gl.enableVertexAttribArray(3);

    return [buffer, vao]
}
export const createProgram = (gl, vertexShaderSource, fragmentShaderSource, varyings) => {

    const program = gl.createProgram()
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.compileShader(vertexShader)
    gl.attachShader(program, vertexShader)

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);

    varyings && gl.transformFeedbackVaryings(program, varyings, gl.INTERLEAVED_ATTRIBS);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        return false
    }

    return program
}

export const draw = (gl, program, buffers, count, state) => {
    gl.useProgram(program)
    const orderedBuffers = [...buffers.slice(0, state.buffer), ...buffers.slice(state.buffer)]

    const position = gl.getAttribLocation(program, 'position')
    const color = gl.getAttribLocation(program, 'color')
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE)
    gl.clear(gl.COLOR_BUFFER_BIT);
    for (let i = 0; i < orderedBuffers.length; i += 2) {
        gl.bindBuffer(gl.ARRAY_BUFFER, orderedBuffers[i])
        gl.enableVertexAttribArray(position)
        gl.vertexAttribPointer(position, 2, gl.FLOAT, false, BUFFER_SIZE * 4, 0)

        gl.enableVertexAttribArray(color)
        gl.vertexAttribPointer(color, 3, gl.FLOAT, false, BUFFER_SIZE * 4, 12)

        gl.drawArrays(gl.POINTS, 0, count)
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

}


export const dataUpdate = (program, gl, state, count, extent, buffers) => {
    gl.useProgram(program)
    gl.enable(gl.RASTERIZER_DISCARD);
    const u_extent = gl.getUniformLocation(program, "u_extent");
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
    const newExtent = [normalizeLongitude(extent[0]) / 180, extent[1] / 90, normalizeLongitude(extent[2]) / 180, extent[3] / 90].map(normalizeValue)
    gl.bindBuffer(gl.TRANSFORM_FEEDBACK_BUFFER, null);
    gl.uniform4fv(u_extent, newExtent)
    gl.bindVertexArray(buffers[state.vao]);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, buffers[state.buffer]);

    gl.beginTransformFeedback(gl.POINTS);

    gl.drawArrays(gl.POINTS, 0, count);

    gl.endTransformFeedback();

    gl.bindVertexArray(null);
    gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);

    state.vao = (state.vao + 2) >= buffers.length ? 1 : state.vao + 2;
    state.buffer = (state.buffer + 2) >= buffers.length ? 0 : state.buffer + 2;
    gl.disable(gl.RASTERIZER_DISCARD);
}

export const createTexture = (gl, image, program) => {
    const texture = gl.createTexture()
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(gl.getUniformLocation(program, 'u_Texture'), 0);
}
export const loadImageData = (gl, program, src, callback) => {
    const image = new Image();

    image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);

        createTexture(gl, image, program)
        callback(true)
    };
    image.src = src
};