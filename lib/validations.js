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
var hasOwnProperty = Function.call.bind(Object.prototype.hasOwnProperty)


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
 * @summary
 * Error → Void → Boolean
 * Error → String → Boolean
 * Error → RegExp → Boolean
 * Error → Function → Boolean
 */
function matchErrorType(error, type) {
  return type == null?      true
  :      isString(type)?    error.message === type
  :      isTestable(type)?  type.test(error)
  :      /* otherwise */    error instanceof type
}

/**
 * Checks if something is a String.
 *
 * @summary α → Boolean
 */
function isString(a) {
  return classOf(a) === '[object String]'
}

/**
 * Checks if something is testable.
 *
 * @summary α → Boolean
 */
function isTestable(a) {
  return a.test && typeof a.test === 'function'
}

// -- Validations ------------------------------------------------------

/**
 * Asserts structural (deep) equality between two values.
 *
 * @method
 * @summary α → β → Validation[Divergence, Divergence]
 */
exports.equals = curry(2, equals)
function equals(a, b) {
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
exports.strictEquals = curry(2, strictEquals)
function strictEquals(a, b) {
  return assert( deepEqual(a, b)
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
exports.isOfType = curry(2, isOfType)
function isOfType(type, a) {
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
exports.isOfClass = curry(2, isOfClass)
function isOfClass(className, a) {
  var actualClass = classOf(a).slice(8, -1)
  return assert( className === actualClass
               , divergence( '{:actual} to be of class "{:class}," got "{:actualClass}"'
                           , '{:actual} to not be of class "{:class}"'
                           ).make({ actual      : a
                                  , 'class'     : className
                                  , actualClass : actualClass }))
}

/**
 * Asserts that a contains something as a value.
 *
 * @method
 * @summary α → Sequence[α] → Validation[Divergence, Divergence]
 */
exports.contains = curry(2, contains)
function contains(x, xs) {
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
exports.matches = curry(2, matches)
function matches(re, text) {
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
exports.has = curry(2, has)
function has(name, object) {
  return assert( name in object
               , divergence( '{:actual} to have property "{:name}"'
                           , '{:actual} to not have property "{:name}"'
                           ).make({ actual: object, name: name }))
}

/**
 * Asserts that a value has a certain own property.
 *
 * @method
 * @summary String → Object → Validation[Divergence, Divergence]
 */
exports.hasOwn = curry(2, has)
function hasOwn(name, object) {
  return assert( hasOwnProperty(object, name)
               , divergence( '{:actual} to have own property "{:name}"'
                           , '{:actual} to not have own property "{:name}"'
                           ).make({ actual: object, name: name }))
}

/**
 * Asserts that a computation throws a particular exception.
 *
 * @method
 * @summary (Void → Void :: partial) → Function → Validation[Divergence, Divergence]
 */
exports['throws'] = curry(2, throws)
function throws(computation, errorType) {
  var _divergence = divergence( 'to throw an error {:errorType}'
                              , 'to not throw an error {:errorType}'
                              ).make({ errorType: errorType || '' })

  try {
    return assert(true, _divergence)
  } catch(e) {
    return assert(matchTypeError(e, errorType), _divergence)
  }
}