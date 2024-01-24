const assert = require('assert')

// Download JSON file from spdx.org.
require('https').request('https://spdx.org/licenses/exceptions.json')
  .once('response', response => {
    assert.strictEqual(response.statusCode, 200)
    const chunks = []
    response
      .on('data', chunk => { chunks.push(chunk) })
      .once('error', error => { assert.ifError(error) })
      .once('end', () => {
        const buffer = Buffer.concat(chunks)
        const spdxJSON = JSON.parse(buffer)
        const listVersion = spdxJSON.licenseListVersion
        console.log(`License List Version: ${listVersion}`)
        const identifiers = []
        const deprecated = []
        spdxJSON.exceptions.forEach(object => {
          const id = object.licenseExceptionId
          if (object.isDeprecatedLicenseId) {
            deprecated.push(id)
          } else {
            identifiers.push(id)
          }
        })
        identifiers.sort()
        deprecated.sort()

        const indexJSON = require('./index')
        const deprecatedJSON = require('./deprecated')

        identifiers.forEach(identifier => {
          assert(indexJSON.includes(identifier), `Missing: ${identifier}`)
        })
        indexJSON.forEach(identifier => {
          assert(identifiers.includes(identifier), `Extra: ${identifier}`)
        })
        assert.deepStrictEqual(indexJSON, identifiers, 'identifiers')
        console.log('index.json is up to date.')

        deprecated.forEach(identifier => {
          assert(deprecatedJSON.includes(identifier), `Missing Deprecated: ${identifier}`)
        })
        deprecatedJSON.forEach(identifier => {
          assert(deprecated.includes(identifier), `Extra Deprecated: ${identifier}`)
        })
        assert.deepStrictEqual(deprecatedJSON, deprecated, 'deprecated')
        console.log('deprecated.json is up to date.')
      })
  })
  .end()
