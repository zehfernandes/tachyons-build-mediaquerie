#!/usr/bin/env node
'use strict'

const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const postcss = require('postcss')
const generate = require('postcss-update-media-queries')
const perfectionist = require('perfectionist')

module.exports = function generateMediaQueries (input, options) {
  const files = []

  options = options || {}

  options.overwrite = options.overwrite || false
  options.variables = options.variables || ''

  // Directory
  if (fs.lstatSync(input).isDirectory()) {
    fs.readdirSync(input).forEach(function (file) {
      if (path.extname(file) === '.css') {
        files.push(input + '/' + file)
      }
    })
  } else {
    files.push(input)
  }

  // Error
  if (files.length === 0) {
    console.error(chalk.red('You dont have any css file in this directory'))
    process.exit(1)
  }

  // Execute multiplefiles
  for (var i = files.length - 1; i >= 0; i--) {
    let mediafile = options.variables || files[i]
    let medias = getCustomMedia(mediafile)

    if (!medias) { continue } // return for eachfile

    let inputFile = files[i]
    let contentFile = fs.readFileSync(inputFile, 'utf8')

    postcss([
      generate({medias: medias, overwrite: options.overwrite}),
      perfectionist({format: 'compressed'}) ]
    ).process(contentFile, { from: inputFile })
      .then(function (result) {
        result.warnings().forEach(function (warn) {
          console.warn(warn.toString())
        })

        fs.writeFileSync(result.opts.from, result.css)
        console.error(chalk.green('Hell Yes! Success file generated: ' + result.opts.from))
      })
  }

  function getCustomMedia (file) {
    // Get medias
    let mediaFile = fs.readFileSync(file, 'utf8')
    let customMedia = /@custom-media\s--([a-z\-]*\-?)+/g

    let match
    let medias = []

    while ((match = customMedia.exec(mediaFile)) !== null) {
      var name = '(--' + match[1] + ')'
      var alias = match[1].replace('breakpoint', '').split('-')
      var shorthand = ''

      for (var i = 0; i < alias.length; i++) {
        shorthand = shorthand + alias[i].charAt(0)
      }

      medias.push({ 'name': name, 'alias': '-' + shorthand })
    }

    if (medias.length === 0) {
      console.error(chalk.red('We don`t find any custom Media Querie. Check your file ' + file))
    } else {
      return medias
    }
  }
}
