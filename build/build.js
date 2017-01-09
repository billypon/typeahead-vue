// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)

/**
 * Build the /dist/ folder
 */
webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')

  var fs = require('fs')
  var stylus = require('stylus')(fs.readFileSync('src/typeahead.styl', 'utf8'))
    .set('filename', 'src/typeahead.styl')
    .set('compress', true)
    .set('sourcemap', true)
    .import('variables.styl')
  stylus.render(function (err, data) {
    if (err) {
      console.error(err.toString())
    } else {
      fs.writeFileSync('dist/typeahead.css', data.replace('src/', ''), 'utf8')
      fs.writeFileSync('dist/typeahead.css.map', JSON.stringify(stylus.sourcemap), 'utf8')
    }
  })
})
