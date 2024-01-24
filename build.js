#!/usr/bin/env node
const fs = require('fs')
const https = require('https')

https.request('https://spdx.org/licenses/exceptions.json', function (response) {
  if (response.statusCode !== 200) {
    console.error('spdx.org responded ' + response.statusCode)
    process.exit(1)
  }
  const chunks = []
  response
    .on('data', function (chunk) {
      chunks.push(chunk)
    })
    .once('end', function () {
      const buffer = Buffer.concat(chunks)
      const parsed = JSON.parse(buffer)
      const exceptions = []
      const deprecated = []
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
