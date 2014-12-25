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
