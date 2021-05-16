
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./msal-express-wrapper.cjs.production.min.js')
} else {
  module.exports = require('./msal-express-wrapper.cjs.development.js')
}
