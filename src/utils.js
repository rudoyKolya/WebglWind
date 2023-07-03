export const loadShader = (gl, type, source) => {
    const shader = gl.createShader(type)
    if (!shader) {
        return null
    }

    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    const isCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
    if (!isCompiled) {
        const error = gl.getShaderInfoLog(shader);
        console.log(error)
        gl.deleteShader(shader)
        return null
    }
    return shader
}

export const createProgram = (gl, vSource, fSource) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fSource);
    if (!vertexShader || !fragmentShader) {
        return null
    }

    const program = gl.createProgram()
    if (!program) {
        return null
    }

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    const isLinked = gl.getProgramParameter(program, gl.LINK_STATUS)
    if (!isLinked) {
        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);
        return null;
    }
    return program
}
export const initShaderProgram = (gl, vSource, fSource) => {
    const program = createProgram(gl, vSource, fSource)
    if (!program) {
        return false
    }

    gl.useProgram(program)
    gl.program = program
    return true
}

export const getScripts = (ref, fShader, vShader) => {
    const gl = ref.current.getContext('webgl')

    return {gl, vertexShaderSource: vShader, fragmentShaderSource: fShader, canvas: ref}
}