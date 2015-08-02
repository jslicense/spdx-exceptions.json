```javascript
var assert = require('assert')
var spdxExceptions = require('spdx-exceptions')

assert(
  Array.isArray(spdxExceptions),
  'module is an Array')

assert(
  spdxExceptions.length > 0,
  'the Array has elements')

assert(
  spdxExceptions.every(function(e) {
    return typeof e === 'string' }),
  'each Array element is a string')
```
