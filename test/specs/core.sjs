// Copyright (c) 2014 Quildreen Motta <quildreen@gmail.com>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software,
// and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var hifive         = require('hifive')
var alright        = require('../../lib')
var claire         = require('claire')
var AssertionError = require('assertion-error')

// Aliases
var spec   = hifive()
var _      = alright
var t      = claire.data
var forAll = claire.forAll

hifive.Test.setTimeout(5000)

// Specification
module.exports = spec('Core', function(it, spec) {

  spec('verify()', function(it) {
    it( 'Should succeed with true if the validation is a success.'
      , function() {
          _.verify(_.ok(true)) => true
      })

    it( 'Should fail with an exception if the validation is a succes.'
      , function() {
          function(){ _.verify(_.ok(false)) } should _.raise(AssertionError)
      })
  })

  spec('not()', function(it) {
    it( 'Should swap the validation values.'
      , function() {
          var d = _.ok(true)
          _.not(d).toString()        => 'Validation.Failure(true to not be ok)'
          _.not(_.not(d)).toString() => d.toString()
      })
  })

})
