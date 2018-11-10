const cfg = require('./src/cfg')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ? cfg.web.pro : cfg.web.dev,
    devServer: {
        watchOptions: {
            poll: true
        },
        public: '0.0.0.0'
    },
    configureWebpack:  {
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: './src/version.js',
                    to: './version.js',
                    toType: 'file'
                },
            ], {})
        ]
    },
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].templateParameters = {
                    'apiBaseUrl': process.env.NODE_ENV === 'production' ? cfg.api.pro : cfg.api.dev,
                    'webBaseUrl': process.env.NODE_ENV === 'production' ? cfg.web.pro : cfg.web.dev
                }
                return args
            })
    }
}