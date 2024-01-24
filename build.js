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
      var exceptions = []
      var deprecated = []
      parsed.exceptions.forEach(object => {
        const id = object.licenseExceptionId
        if (object.isDeprecatedLicenseId) {
          deprecated.push(id)
        } else {
          exceptions.push(id)
        }
      })
      write('index', exceptions)
      write('deprecated', deprecated)
    })
}).end()

function write (file, list) {
  fs.writeFileSync(
    file + '.json',
    JSON.stringify(list.sort(), null, 2) + '\n'
  )
}
