export const particlesNumber = 10000
export const trailLength = 10

export const speedFactor = 2


export const generateParticle = (oldPositions = []) => {
    return ({
        x: (Math.random() * 2) - 1,
        y: (Math.random() * 2) - 1,
        life: Math.ceil(Math.random() * 200),
        oldPositions,
    })
}

export const generateParticles = (particles) => {
    let currentArea = 0
    while (currentArea < particlesNumber) {
        particles.push(generateParticle())
        currentArea += 1
    }
}
export const mapToIndex = (number, n) =>  {
    return Math.round((number + 1) * (n - 1) / 2);
}
export const convert = (x, y, width, height) => {
    return {
        x: mapToIndex(x, width),
        y: mapToIndex(y, height),
    }
}


export const updateParticles = (particles, speedFactor, windDirectionData) => {
    particles.forEach((particle) => {
        const oldPosition = {x: particle.x, y: particle.y}
        particle.life += 1;
        const {x, y} = convert(particle.x, particle.y, windDirectionData[0].length, windDirectionData.length)
        const vx = windDirectionData[y][x].r / 255 * 2 - 1;
        const vy = windDirectionData[y][x].g / 255 * 2 - 1;
        const speed = windDirectionData[y][x].g / 255 + windDirectionData[y][x].r / 255;
        if (particle.life >= 300 || (particle.x + (vx * speedFactor * speed)) > 1 || (particle.x + (vx * speedFactor * speed)) < -1 || (particle.y + (vy * speedFactor * speed)) > 1 || (particle.y + (vy * speedFactor * speed)) < -1) {
            Object.assign(particle, generateParticle(particle.oldPositions));
        } else {
            particle.x += (vx * speedFactor * speed);
            particle.y += (vy * speedFactor * speed);
            particle.oldPositions.unshift(oldPosition);
            if (particle.oldPositions.length > trailLength) {
                particle.oldPositions.pop();
            }
        }
    });
}