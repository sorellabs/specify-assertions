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

/**
 * Provides common validation functions.
 *
 * @module lib/validations
 */

// -- Dependencies -----------------------------------------------------
var curry            = require('core.lambda').curry
var deepEqual        = require('deep-equal')
var Validation       = require('data.validation')
var singleDivergence = require('./divergence').divergence
var divergence       = require('./divergence').invertibleDivergence


// -- Aliases ----------------------------------------------------------
var Success        = Validation.Success
var Failure        = Validation.Failure
var classOf        = Function.call.bind(Object.prototype.toString)
var isPrototypeOf  = Function.call.bind(Object.prototype.isPrototypeOf)

// -- Helpers ----------------------------------------------------------

/**
 * Makes an assertion about a piece of data.
 *
 * This is a low-level method, and should be only used as a basis for
 * constructing higher-level validations, not as a validation itself.
 *
 * @method
 * @summary Boolean → Divergence → Object → Validation[Divergence, Divergence]
 */
exports.assert = curry(2, assert)
function assert(thing, divergence) {
  return thing?           Success(divergence)
  :      /* otherwise */  Failure(divergence)
}

/**
 * Checks if an exception matches an expected type.
 *
 * @private
 * @summary
 * Error → Void → Boolean
 * Error → String → Boolean
 * Error → RegExp → Boolean
 * Error → Function → Boolean
 */
function matchErrorType(error, type) {
  return type == null?      false
  :      isString(type)?    error.message === type
  :      isTestable(type)?  type.test(error)
  :      /* otherwise */    error instanceof type
}

/**
 * Checks if something is a String.
 *
 * @private
 * @summary α → Boolean
 */
function isString(a) {
  return classOf(a) === '[object String]'
}

/**
 * Checks if something is testable.
 *
 * @private
 * @summary α → Boolean
 */
function isTestable(a) {
  return a.test && typeof a.test === 'function'
}

/**
 * Inverts a divergence.
 *
 * @private
 * @summary Divergence → Divergence
 */
function invert(a) {
  return a.inverse()
}


// -- Validations ------------------------------------------------------

/**
 * Negates an assertion function.
 *
 * @method
 * @summary (α → Validation[Divergence, Divergence]) → α → Validation[Divergence, Divergence]
 */
exports.not = curry(2, not)
function not(checker, a) {
  return checker(a).swap()
                   .bimap(invert, invert)
}

/**
 * Asserts structural (deep) equality between two values.
 *
 * @method
 * @summary α → β → Validation[Divergence, Divergence]
 */
exports.equal = curry(2, equal)
function equal(a, b) {
  return assert( deepEqual(a, b)
               , divergence( '{:actual} to structurally equal {:expected}'
                           , '{:actual} to not structurally equal {:expected}'
                           ).make({ expected: a, actual: b }))
}

/**
 * Asserts that something is truthy.
 *
 * @method
 * @summary α → Validation[Divergence, Divergence]
 */
exports.ok = ok
function ok(a) {
  return assert( !!a
               , divergence( '{:actual} to be ok'
                           , '{:actual} to not be ok'
                           ).make({ actual: a }))
}

/**
 * Asserts strict equality (===) between two values.
 *
 * @method
 * @summary α → β → Validation[Divergence, Divergence]
 */
exports.strictEqual = curry(2, strictEqual)
function strictEqual(a, b) {
  return assert( a === b
               , divergence( '{:actual} to structurally equal {:expected}'
                           , '{:actual} to not structurally equal {:expected}'
                           ).make({ expected: a, actual: b }))
}

/**
 * Asserts that something is of a certain type (according to `typeof`).
 *
 * @method
 * @summary String → α → Validation[Divergence, Divergence]
 */
exports.haveType = curry(2, haveType)
function haveType(type, a) {
  return assert( typeof a === type
               , divergence( '{:actual} to be of type "{:type}"'
                           , '{:actual} to not be of type "{:type}"'
                           ).make({ type: type, actual: a }))
}

/**
 * Asserts that something has a certain internal `[[Class]]`.
 *
 * @method
 * @summary String → α → Validation[Divergence, Divergence]
 */
exports.haveClass = curry(2, haveClass)
function haveClass(className, a) {
  var actualClass = classOf(a).slice(8, -1)
  return assert( className === actualClass
               , divergence( '{:actual} to be of class "{:class}," got "{:actualClass}"'
                           , '{:actual} to not be of class "{:class}"'
                           ).make({ actual      : a
                                  , 'class'     : className
                                  , actualClass : actualClass }))
}

/**
 * Asserts that something has another thing in its prototype chain.
 *
 * @method
 * @summary Object → Object → Validation[Divergence, Divergence]
 */
exports.inheritFrom = curry(2, inheritFrom)
function inheritFrom(proto, a) {
  return assert( isPrototypeOf(proto, a)
               , divergence( '{:actual} to inherit from {:proto}'
                           , '{:actual} to not inherit from {:proto}'
                           ).make({ actual: a
                                  , proto:  proto }))
}

/**
 * Asserts that a contains something as a value.
 *
 * @method
 * @summary α → Sequence[α] → Validation[Divergence, Divergence]
 */
exports.contain = curry(2, contain)
function contain(x, xs) {
  return assert( xs.indexOf(x) != -1
               , divergence( '{:actual} to contain {:thing}'
                           , '{:actual} to not contain {:thing}'
                           ).make({ actual: xs, thing: x }))
}

/**
 * Asserts that a value matches a regular expression.
 *
 * @method
 * @summary RegExp → String → Validation[Divergence, Divergence]
 */
exports.match = curry(2, match)
function match(re, text) {
  return assert( re.test(text)
               , divergence( '{:text} to match {:re}'
                           , '{:text} to not match {:re}'
                           ).make({ text: text, re: re }))
}

/**
 * Asserts that a value has a certain property.
 *
 * @method
 * @summary String → Object → Validation[Divergence, Divergence]
 */
exports.have = curry(2, have)
function have(name, object) {
  return assert( name in object
               , divergence( '{:actual} to have property "{:name}"'
                           , '{:actual} to not have property "{:name}"'
                           ).make({ actual: object, name: name }))
}

/**
 * Asserts that a computation throws a particular exception.
 *
 * @method
 * @summary Error → (Void → Void :: partial) → Validation[Divergence, Divergence]
 */
exports.raise = curry(2, raise)
function raise(errorType, computation) {
  var _divergence = divergence( 'to throw an error {:errorType}'
                              , 'to not throw an error {:errorType}'
                              ).make({ errorType: errorType || '' })

  try {
    computation()
    return assert(true, _divergence)
  } catch(e) {
    return assert(matchErrorType(e, errorType), _divergence)
  }
}