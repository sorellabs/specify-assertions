require('es5-shim')
require('es5-shim/es5-sham')

var hifive = require('hifive')
var tap    = require('hifive-tap')
var specs  = require('./specs')

hifive.run(specs, tap()).otherwise(function() {
  if (typeof process != 'undefined')  process.exit(1)
})