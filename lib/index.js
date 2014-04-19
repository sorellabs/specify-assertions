// Copyright (c) 2014 Quildreen Motta
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

/**
 * Beautiful assertion library.
 *
 * @module lib/index
 */

// -- Dependencies -----------------------------------------------------
var AssertionError = require('assertion-error')
var Future         = require('data.future')
var identity       = require('core.lambda').identity
var compose        = require('core.lambda').compose
var curry          = require('core.lambda').curry
var extend         = require('boo').extend


// -- Helpers ----------------------------------------------------------

/**
 * Raises an exception.
 *
 * @private
 * @summary Error → Void        :: partial, throws
 */
function raise(error) {
  throw error
}

/**
 * Transforms a divergence into an assertion error.
 *
 * @private
 * @summary Divergence → AssertionError
 */
function toError(divergence) {
  return new AssertionError( 'Expected ' + divergence.toString()
                           , divergence )
}


// -- Assertion primitives ---------------------------------------------

/**
 * Verifies if an assertion is correct.
 *
 * @method
 * @summary α → (α → Validation[Divergence, Divergence]) → Divergence     :: partial, throws
 */
exports.verify = verify
function verify(a, checker) {
  return checker(a).fold( compose(raise, toError)
                        , identity)
}

/**
 * Verifies if an assertion is correct asynchronously, for Promises/A+.
 *
 * @method
 * @summary Promise[Error, α] → (α → Validation[Divergence, Divergence]) → Promise[AssertionError, Divergence]
 */
exports.verifyPromise = curry(2, verifyPromise)
function verifyPromise(promise, checker) {
  return promise.then(function(a) {
                        return verify(a, checker) })
}

/**
 * Verifies if an assertion is correct asynchronously, for fantasy-land monads.
 *
 * @method
 * @summary (m:Monad[_]) => m[α] → (α → Validation[Divergence, Divergence]) → m[Validation[AssertionError, Divergence]]
 */
exports.verifyMonad = curry(2, verifyMonad)
function verifyMonad(monad, checker) {
  return monad.map(function(a) {
                     return checker(a).bimap(toError, identity) })
}

/**
 * Verifies if an assertion is correct asynchronously, for monadic Futures.
 *
 * @method
 * @summary Future[α, β] → (α → Validation[Divergence, Divergence]) → Future[AssertionError, Divergence]
 */
exports.verifyFuture = curry(2, verifyFuture)
function verifyFuture(future, checker) {
  return verifyMonad(future, checker)
           .chain(function(a){ return new Future(propagate(a)) })

  function propagate(a){ return function(reject, resolve) {
    return a.fold(reject, resolve) }}
}


// -- Other exports ----------------------------------------------------
extend(exports, require('./validations'))
exports.divergence = require('./divergence')