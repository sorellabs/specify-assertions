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

var spec           = require('hifive')()
var alright        = global.alright = require('../../lib')
var claire         = require('claire')
var k              = require('core.lambda').constant
var deepEq         = require('deep-equal')
var extend         = require('boo').extend
var AssertionError = require('assertion-error')

// Aliases
var _       = alright
var t       = claire.data
var forAll  = claire.forAll
var classOf = Function.call.bind(Object.prototype.toString)

// Data types
var Any  = claire.sized(k(10), t.Any)
var List = function(a){ return claire.sized(k(10), t.Array(a)) }
var Map  = function(a){ return claire.sized(k(10), t.Object(a)) }
var Errs = claire.label('Errs', claire.asGenerator(function() {
  return pick([TypeError, SyntaxError, RangeError, ReferenceError])
}))

// Helpers
function notEmpty(as){ return as.length > 0 }
function pick(as){ return as[Math.floor(Math.random() * as.length)] }
function shuffle(a){ return a.sort(function(x,y){ return Math.random() - 0.5 })}


// Specification
module.exports = spec('Validations', function(it, spec) {

  spec('assert()', function(it) {
    var divergence = _.divergence.Divergence

    it( 'Should create a successful validation if the assertion is true.'
      , function() {
          _.assert(true, divergence).isSuccess => true
          _.assert(true, divergence).get()     => divergence
        })

    it( 'Should create a failed validation if the assertion fails.'
      , function() {
          _.assert(false, divergence).isFailure    => true
          _.assert(false, divergence).swap().get() => divergence
        })
  })

  it( 'equal(α, β) should succeed if α and β are structurally equal'
    , forAll(Any, Any).satisfy(function(a, b) {
        return (
          _.equal(a)(a).isSuccess => true,
          _.equal(b)(b).isSuccess => true,
          _.equal(a)(b).isSuccess => deepEq(a, b)
        )
      }).asTest())

  it( 'ok(α) should succeed whenever α is truthy'
    , forAll(Any).satisfy(function(a) {
        return _.ok(a).isSuccess => !!a
      }).asTest())

  it( 'strictEqual(α, β) should succeed if α and β are strict equal'
    , forAll(Any, Any).satisfy(function(a, b) {
        return (
          _.strictEqual(a)(a).isSuccess => a === a,
          _.strictEqual(b)(b).isSuccess => b === b,
          _.strictEqual(a)(b).isSuccess => a === b
        )
      }).asTest())

  it( 'beOfType(α, β) should succeed whenever β is of type α'
    , forAll(Any).satisfy(function(a) {
        return _.beOfType(typeof a)(a).isSuccess => true
      }).asTest())

  it( 'beOfClass(α, β) should succeed whenever β has class α'
    , forAll(Any).satisfy(function(a) {
        return _.beOfClass(classOf(a).slice(8, -1))(a).isSuccess => true
      }).asTest())

  it( 'contain(α, β) should succeed whenever β contains α'
    , forAll(List(Any)).given(notEmpty).satisfy(function(as) {
        return (
          _.contain(pick(as))(as).isSuccess => true,
          _.contain({})(as).isFailure       => true
        )
      }).asTest())

  it( 'match(α)(β) should succeed whenever α successfully matches β'
    , forAll(t.Str).satisfy(function(a) {
        // TODO
      }).asTest()
    ).disable()

  it( 'have(α)(β) should succeed whenever β has a property α'
    , forAll(Map(t.Int), List(t.Id)).satisfy(function(a, bs) {
        var keys = shuffle(Object.keys(a).concat(bs))
        var key  = pick(keys)

        return _.have(key)(a).isSuccess => key in a
      }).asTest())

  it( 'raise(α)(β) should succeed whenever β() throws α'
    , forAll(Errs).satisfy(function(e) {
        return (
          function(){ throw e('foo') } should _.raise(e),
          function(){ throw e('foo') } should _.raise('foo'),
          function(){ throw e('foo') } should _.raise(/oo/),
          function(){ throw e('foo') } should not _.raise(AssertionError)
        )
    }).asTest())

})
