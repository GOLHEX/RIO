module.exports = {
        module: {
            rules: [
                {
                    test: /\.сss$/,
                    exclude: /node_modules/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'resolve-url',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        'babel-loader'
                    ]

                }
            ]
        }
};