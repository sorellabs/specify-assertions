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

var hifive  = require('hifive')
var alright = require('../alright')
var _       = require('../../lib').divergence
var claire  = require('claire')
var show    = require('util').inspect

// Aliases
var spec   = hifive()
var $      = alright
var t      = claire.data
var forAll = claire.forAll

hifive.Test.setTimeout(5000)

// Specification
module.exports = spec('Divergence', function(it, spec) {

  spec('divergence()', function(it) {

    it( 'Should make a divergence with the given message.'
      , forAll(t.Id).satisfy(function(a) {
          return _.divergence(a).make({}).toString() => a
        }).asTest())
 
    it( 'Should not be invertible'
      , forAll(t.Str).satisfy(function(a) {
          return function(){ _.divergence(a).inverse() } should $.raise(Error)
        }).asTest())

    it( 'Should format the string according to the template and data.'
       , function() {
           var d = _.divergence('{:a} == {:b}').make({ a: 'foo', b: ['qux', 1] })
           d.toString() => (show('foo') + ' == ' + show(['qux', 1]))
       })

  })

  spec('invertibleDivergence()', function(ti) {

    it( 'Should make a divergence and its inverse.'
      , forAll(t.Id, t.Id).satisfy(function(a, b) {
          var d = _.invertibleDivergence(a, b).make({})
          return (
            d.toString() => a,
            d.inverse().toString() => b,
            d.inverse().inverse() => d
          )
        }).asTest())

  })

})
