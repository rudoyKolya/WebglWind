export const loadImageData = (src, callback) => {
    const image = new Image()
    const data = []
    image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = image.width
        canvas.height = image.height

        ctx.drawImage(image, 0, 0)
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const imageData = img.data
        for (let i = 0; i < imageData.length; i += 4) {
            data.push({
                r: imageData[i],
                g: imageData[i + 1],
                b: imageData[i + 2],
            });
        }
        const groupedData = data.reduce((res, _, id, arr) => {
            if (id % img.width === 0) {
                res.push(arr.slice(id, id + img.width))
            }
            return res
        }, []).reverse()
        callback(groupedData)
    }
    image.src = src
}