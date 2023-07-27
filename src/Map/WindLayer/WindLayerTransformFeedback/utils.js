import {BUFFER_SIZE} from "./consts";

export const normalizeLongitude = (lon) => {
    while (lon < -180) lon += 360;
    while (lon > 180) lon -= 360;
    return lon;
}

export const normalizeValue = (value) => {
    return (value + 1) / 2;
}

const generateParticle = () => ([
    (Math.random() * 2) - 1,
    (Math.random() * 2) - 1,
    Math.ceil(Math.random() * 300),
    0,
    0,
    0,
    0,
])
export const generateParticles = (count) => {
    const particles = new Float32Array(count * BUFFER_SIZE)
    for (let i = 0; i < count * BUFFER_SIZE; i += BUFFER_SIZE) {
        particles.set([...generateParticle()], i)
    }
    return particles
}

export const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}