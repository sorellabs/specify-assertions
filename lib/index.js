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
var curry          = require('core.lambda').curry
var constant       = require('core.lambda').constant
var deepEqual      = require('deep-equal')
var Validation     = require('data.validation')
var boo            = require('boo')
var show           = require('util').inspect


// -- Aliases ----------------------------------------------------------
var Success = Validation.Success
var Failure = Validation.Failure


// -- Helpers ----------------------------------------------------------

/**
 * Raises an exception.
 *
 * @summary Divergence → Void        :: partial, throws
 */
function raise(divergence) {
  throw new AssertionError( 'Expected ' + divergence.toString()
                          , divergence )
}

/**
 * Inverts a divergence.
 *
 * @summary Divergence → Divergence
 */
function invert(a) {
  return a.inverse()
}


// -- Assertion divergences primitives ---------------------------------

/**
 * Represents a failed expectation in an assertion.
 *
 * @class
 * @summary
 * boo.Base <| Divergence
 * : new(Object) → Divergence
 */
var Divergence = boo.Base.derive({
  init: function(a) {
    this.actual = a.actual
    this.expected = a.expected
  }

  /**
   * Inverses this expectation.
   *
   * @summary Void → Divergence
   */
, invert: function() {
    throw new Error('This divergence doesn\'t have an inverse.')
  }
})

var EqualityDivergence = Divergence.derive({
  inverse: function() {
    return InequalityDivergence.make(this)
  }

, toString: function() {
    return show(this.actual) + ' to structurally equal ' + show(this.expected)
  }
})

var InequalityDivergence = Divergence.derive({
  inverse: function() {
    return EqualityDivergence.make(this)
  }

, toString: function() {
    return show(this.actual) + ' to not structurally equal ' + show(this.expected)
  }
})

// -- Assertion primitives ---------------------------------------------

/**
 * Verifies if a property is correct.
 *
 * @method
 * @summary Validation[α, β] → Boolean          :: partial, throws
 */
exports.verify = verify
function verify(validation) {
  return validation.fold(raise, constant(true))
}

/**
 * Inverts a Validation containing a divergence.
 *
 * @method
 * @summary Validation[Divergence, α] → Validation[Divergence, α]
 */
exports.not = not
function not(validation) {
  return validation.swap()
                   .bimap(invert, invert)
}


// -- Assertions -------------------------------------------------------

/**
 * Validates the equality of two values.
 *
 * @method
 * @summary α → β → Validation[Divergence, Divergence]
 */
exports.equals = curry(2, equals)
function equals(a, b) {
  var result = EqualityDivergence.make({ actual   : a
                                       , expected : b })

  return deepEqual(a, b)?  Success(result)
  :      /* otherwise */   Failure(result)
}