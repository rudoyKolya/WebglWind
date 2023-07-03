export const getSubArray = (worldArray, extent, worldExtent) => {
    const m = worldArray.length;
    const n = worldArray[0].length;

    const [minX, minY, maxX, maxY] = extent;

    const [minWorldX, minWorldY, maxWorldX, maxWorldY] = worldExtent;

    let iMin = Math.floor(((minY - minWorldY) / (maxWorldY - minWorldY)) * m);
    let iMax = Math.floor(((maxY - minWorldY) / (maxWorldY - minWorldY)) * m);
    let jMin = Math.floor(((minX - minWorldX) / (maxWorldX - minWorldX)) * n);
    let jMax = Math.floor(((maxX - minWorldX) / (maxWorldX - minWorldX)) * n);

    const jMinWrapped = ((jMin % n) + n) % n;
    const jMaxDiff = jMax - jMin;
    let jMaxWrapped = (jMinWrapped + jMaxDiff) % n;
    const splitHorizontally = jMinWrapped > jMaxWrapped;

    if (jMaxDiff >= n || splitHorizontally) {
        const left = worldArray.slice(iMin, iMax).map(row => row.slice(jMinWrapped));
        const right = worldArray.slice(iMin, iMax).map(row => row.slice(0, jMaxWrapped));
        return left.map((row, i) => [...row, ...right[i]]);
    } else {
        return  worldArray.slice(iMin, iMax).map(row => row.slice(jMinWrapped, jMaxWrapped));
    }
}
