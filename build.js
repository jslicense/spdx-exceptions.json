#!/usr/bin/env node
var fs = require('fs')
var https = require('https')

https.request('https://spdx.org/licenses/exceptions.json', function (response) {
  if (response.statusCode !== 200) {
    console.error('spdx.org responded ' + response.statusCode)
    process.exit(1)
  }
  var chunks = []
  response
    .on('data', function (chunk) {
      chunks.push(chunk)
    })
    .once('end', function () {
      var buffer = Buffer.concat(chunks)
      var parsed = JSON.parse(buffer)
      var output = parsed.exceptions
        .map(function (exception) {
          return exception.licenseExceptionId
        })
        .sort()
      fs.writeFile(
        'index.json',
        JSON.stringify(output, null, 2),
        function (error) {
          if (error) throw error
        }
      )
    })
}).end()
