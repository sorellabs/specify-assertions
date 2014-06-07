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
var claire         = require('claire')
var AssertionError = require('assertion-error')
var _              = require('../../lib')
var pinky          = require('pinky')
var Future         = require('data.future')
var identity       = require('core.lambda').identity

// Aliases
var spec   = hifive()
var t      = claire.data
var forAll = claire.forAll

hifive.Test.setTimeout(5000)

function checkFailure(p) {
  return p.then( function(a){ throw AssertionError(a) }
               , function(e){ return e })
}

function fromMonad(m) {
  return m.chain(function(a) {
                   var p = pinky()
                   return m.of(a.fold(p.reject.bind(p), p.fulfill.bind(p))) })
          .fork(identity, identity)
}

function fromFuture(f) {
  var p = pinky()
  return f.fork(p.reject.bind(p), p.fulfill.bind(p))
}


// Specification
module.exports = spec('Core', function(it, spec) {

  spec('verify()', function(it) {
    it( 'Should succeed with true if the validation is a success.'
      , function() {
          _.verify(true, _.ok).toString() => 'true to be ok'
      })

    it( 'Should fail with an exception if the validation is a succes.'
      , function() {
          function(){ _.verify(false, _.ok) } should _.raise(AssertionError)
      })
  })

  spec('verifyPromise()', function(it) {
    it( 'Should succeed with true if the validation is a success.'
      , function() {
          return _.verifyPromise(pinky(true), _.ok) will be _.ok
      })

    it( 'Should fail with an exception if the validation is a succes.'
      , function() {
          return checkFailure(_.verifyPromise(pinky(false), _.ok))
      })
  })

  spec('verifyMonad()', function(it) {
    it( 'Should succeed with true if the validation is a success.'
      , function() {
          return fromMonad(_.verifyMonad(Future.of(true), _.ok)) will be _.ok
      })

    it( 'Should fail with an exception if the validation is a succes.'
      , function() {
          return checkFailure(fromMonad(_.verifyMonad(Future.of(false), _.ok)))
      })
  })

  spec('verifyFuture()', function(it) {
    it( 'Should succeed with true if the validation is a success.'
      , function() {
          return fromFuture(_.verifyFuture(Future.of(true), _.ok)) will be _.ok
      })

    it( 'Should fail with an exception if the validation is a succes.'
      , function() {
          return checkFailure(fromFuture(_.verifyFuture(Future.of(false), _.ok)))
      })
  })
  
})
