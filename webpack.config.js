module.exports = {
    module: {
        rules: [
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: [
                    'webpack-glsl-loader'
                ]
            }
        ]
    }
}