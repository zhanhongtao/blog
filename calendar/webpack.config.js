var dev = process.env.NODE_ENV === 'development'

var path = require('path')
var fs = require('fs')
var webpack = require('webpack')
var argv = require('yargs').argv
var config = require('./package.json')

let d = argv.d ? argv.d : 'system'
let _config = config[d][dev ? 'development' : 'production']
config.input = _config.input
config.output = _config.output
config.public = _config.public

// 清理 release 目录
var CleanWebpackPlugin = require('clean-webpack-plugin')
var cleanReleaseDirectory = new CleanWebpackPlugin([config.output], {
  root: __dirname,
  verbose: true,
  dry: false,
  allowExternal: true
})

// 生成最终静态文件(html)
// 向页面中插入脚本时, 保证脚本顺序
var HtmlWebpackPlugin = require('html-webpack-plugin')
function createInjectOrderMethod (orders) {
  return function (chunk1, chunk2) {
    var o1 = orders.indexOf(chunk1.names[0])
    var o2 = orders.indexOf(chunk2.names[0])
    return o1 > o2 ? 1 : -1
  }
}

// 针对 development 和 production 环境写 plugs/rules
var plugins = []
var rules = []

// 读 ./src 目录下所有含有 index.js 文件目录.
// 同时生成 html 配置.
const entry = {}

var commonchunkname = 'vendor'
var basecommonchunk = []
if (dev === false) {
  basecommonchunk = [...basecommonchunk, commonchunkname]
}
var commonchunk = [commonchunkname]

let list = fs.readdirSync(path.resolve(config.input))
for (let dir of list) {
  if (dir[0] === '_') continue
  let filename = path.resolve(config.input, dir, 'index.js')
  let exist = fs.existsSync(filename)
  if (exist) {
    if (dir[0] === '_') continue
    commonchunk = [...commonchunk, dir]
    entry[dir] = filename
    let chunks = [...basecommonchunk, dir]
    plugins = [...plugins, new HtmlWebpackPlugin({
      filename: `${dir}.html`,
      template: path.resolve(config.input, dir, `tpl.html`),
      inject: true,
      chunks: chunks,
      chunksSortMode: createInjectOrderMethod(chunks),
      hash: dev,
      minify: false
    })]
  }
}

// common.
if (dev === false) {
  plugins = [...plugins, new webpack.optimize.CommonsChunkPlugin({
    name: commonchunkname,
    minChunks: 2,
    chunks: commonchunk
  })]
}

// css.
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var componentExtractText = new ExtractTextPlugin({
  filename: 'style/component.[name].css?[contenthash]',
  disable: dev
})
var scssExtractText = new ExtractTextPlugin({
  filename: dev ? 'style/[name].css' : 'style/[name].css?[contenthash]',
  disable: dev
})
plugins = [...plugins, componentExtractText, scssExtractText]

var baseCSSRules = [
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true,
      plugins: function () {
        return [
          require('precss'),
          require('autoprefixer')
        ]
      }
    }
  },
  {
    loader: 'resolve-url-loader'
  },
  {
    loader: 'sass-loader',
    options: {
      sourceMap: true
    }
  }
]

rules = [...rules, {
  test: /\.scss$/,
  include: /component/,
  use: componentExtractText.extract({
    fallback: [
      {
        loader: 'style-loader',
        options: {
          singleton: true
        }
      }
    ],
    publicPath: '../',
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[local]_[hash:base64:5]',
          importLoaders: 3,
          sourceMap: true
        }
      },
      ...baseCSSRules
    ]
  })
}, {
  test: /\.scss$/,
  exclude: /component/,
  use: scssExtractText.extract({
    fallback: [
      {
        loader: 'style-loader',
        options: {
          singleton: true
        }
      }
    ],
    publicPath: '../',
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          localIdentName: '[local]_[hash:base64:5]',
          importLoaders: 3,
          sourceMap: true
        }
      },
      ...baseCSSRules
    ]
  })
}]

// js
if (dev === false) {
  var UglifyJsPlugin = require('webpack-uglify-js-plugin')
  var uglifyJavaScript = new UglifyJsPlugin({
    cacheFolder: path.resolve(__dirname, 'cache'),
    minimize: true,
    sourceMap: true,
    output: {
      comments: false
    },
    compressor: {
      warnings: false
    }
  })
  plugins = [...plugins, uglifyJavaScript]
}

// image
var imageRuleConfig = {
  test: /\.(?:jpg|jpg-large|png|gif|svg|ttf|woff|eot)$/,
  use: [
    {
      loader: 'url-loader',
      options: {
        limit: 1024,
        name: 'images/[name].[ext]' + (dev ? '' : '?[hash]')
      }
    }
  ]
}

if (dev === false) {
  // https://github.com/tcoopman/image-webpack-loader
  imageRuleConfig.use = [
    ...imageRuleConfig.use,
    {
      loader: 'image-webpack-loader',
      query: {
        progressive: true,
        optimizationLevel: 7,
        interlaced: false,
        pngquant: {
          quality: '65-90',
          speed: 4
        }
      }
    }
  ]
}

rules = [...rules, imageRuleConfig]

module.exports = {
  context: __dirname,
  target: 'web',
  devtool: dev ? 'cheap-module-source-map' : 'source-map',
  resolveLoader: {
    alias: {}
  },
  resolve: {
    extensions: ['*', '.js', '.css', '.scss', '.tpl', '.html', '.png', '.jpg'],
    modules: [
      'node_modules'
    ],
    alias: {
      zepto: path.resolve(__dirname, 'src/script/zepto.min.js')
    }
  },
  entry: entry,
  output: {
    filename: dev ? `script/[name].js` : `script/[name].js?[chunkhash]`,
    path: path.resolve(__dirname, config.output),
    pathinfo: true,
    sourceMapFilename: 'sourceMaps/[file].map',
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]',
    publicPath: config.public ? config.public : ''
  },
  externals: {},
  plugins: [
    cleanReleaseDirectory,
    ...plugins
  ],
  module: {
    rules: [
      {
        test: /zepto(\.min)?\.js$/,
        use: [
          {
            loader: 'exports-loader?Zepto; delete window.$; delete window.Zepto;'
          }
        ]
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'common')
        ],
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 4000,
              name: 'script/common/[name].[ext]?[hash]'
            }
          }
        ]
      },
      // 转 JavaScript
      {
        test: /\.js$/,
        exclude: [
          /node_modules/,
          path.resolve(__dirname, 'common')
        ],
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['env'],
              plugins: ['transform-runtime']
            }
          }
        ]
      },
      // 引入 css 文件
      {
        test: /\.css$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2048,
              name: 'style/[name].[ext]?[hash]'
            }
          }
        ]
      },
      {
        test: /\.xhtml/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['env'],
              plugins: ['transform-runtime']
            }
          },
          {
            loader: 'es6-string-template-loader'
          }
        ]
      },
      // 生成 html 文件
      {
        test: /\.(?:html)$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false,
              interpolate: 'require',
              attrs: ['img:src', 'link:href', 'script:src']
            }
          }
        ]
      },
      ...rules
    ]
  }
}
