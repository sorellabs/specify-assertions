/// matchers.js --- Common matchers
//
// Copyright (c) 2012 Quildreen Motta
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

var Assertion = require('./core').Assertion

var array_p   = Array.isArray
var keys      = Object.keys
var slice     = [].slice.call.bind([].slice)

function class_of(subject) {
  return {}.toString.call(subject).slice(8, -1) }

function all(xs, f, idx) {
  return slice(xs, idx || 0).every(f) }

function class_p(cls) {
  return all(arguments, function(o){ return class_of(o) == cls }, 1)}

function type_p(type) {
  return all(arguments, function(o){ return typeof o == type }, 1) }

function arguments_p() {
  return all(arguments, function(o){ return class_of(o) == 'Arguments' })}

function error_p(o) { return o instanceof Error }

function re_p(o){ return class_of(o) == 'RegExp' }


// Deep strict equality
//
// Based on Node.js's assert module's deepEqual
function deep_equal(actual, expected) {
  return actual === expected
  ||     eq_date(actual, expected)
  ||     eq_regexp(actual, expected)
  ||     eq_abstract(actual, expected)
  ||     eq_object(actual, expected)
  ||     false }

function eq_date(actual, expected) {
  return class_p('Date', actual, expected)
  &&     actual.getTime() === expected.getTime() }

function eq_regexp(actual, expected) {
  return class_p('RegExp', actual, expected)
  &&     actual.source     === expected.source
  &&     actual.global     === expected.global
  &&     actual.multiline  === expected.multiline
  &&     actual.lastIndex  === expected.lastIndex
  &&     actual.ignoreCase === expected.ignoreCase }

function eq_abstract(actual, expected) {
  return !type_p('object', actual, expected)
  &&     actual == expected }

function eq_object(actual, expected) {
  var a, b

  if (actual == null || expected == null)
    return false

  if (actual.prototype !== expected.prototype)
    return false

  if (arguments_p(actual)) {
    if (!arguments_p(expected))  return false
    return deep_equal(slice(actual), slice(expected)) }

  try {
    a = keys(actual)
    b = keys(expected) }
  catch(e) {
    return false }

  if (a.length !== b.length)  return false

  a.sort()
  b.sort()
  return a.every(function(k, i){ return k == b[i]                             })
  &&     a.every(function(k, i){ return deep_equal(actual[k], expected[b[i]]) })}




// -- Core matchers --
Assertion.define('equals'
, 'equal {:actual}.'
, function(actual) {
    this.store('actual', actual)
    this.satisfy(function(expected) { return deep_equal(actual, expected) })
})


Assertion.define('same'
, 'be {:actual}.'
, function(actual) {
    this.store('actual', actual)
    this.satisfy(function(expected){ return expected === actual })
})


Assertion.define('property'
, 'have property {:key}.'
, function(prop, value) {
    this.store('key', prop)
    if (value) {
      this.satisfy(function(expected) {
        this.store('value', value)
        this.store('actual', expected[prop])
        this.describe('have property {:key} with value {:value}, got {:actual}', true)
        return expected[prop] === value }.bind(this))}
    else
      this.satisfy(function(expected){ return prop in expected })
})


Assertion.define('contains'
, 'contain {:value}.'
, function(value) {
    this.store('value', value)
    this.satisfy(function(expected){ return expected.indexOf(value) !== -1 })
})


Assertion.define('ok'
, 'be ok.'
, function() {
    this.satisfy(function(expected){ return !!expected })
})


Assertion.define('empty'
, 'be empty.'
, function() {
    this.satisfy(function(expected){ return array_p(expected)?  expected.length == 0
                                     :      /* otherwise */     keys(expected).length == 0 })
})


Assertion.define(['above', '>']
, 'be above {:value}.'
, function(value) {
    this.store('value', value)
    this.satisfy(function(expected){ return expected > value })
})


Assertion.define(['below', '<']
, 'be below {:value}.'
, function(value) {
    this.store('value', value)
    this.satisfy(function(expected){ return expected < value })
})


Assertion.define('within'
, 'be within {:lower} and {:upper}.'
, function(lower, upper) {
    this.store('lower', lower)
    this.store('upper', upper)
    this.satisfy(function(expected){ return expected >= lower
                                     &&     expected <= upper })
})


Assertion.define('throws'
, 'throw {:error}.'
, function(error) {
    this.store('error', error_p(error)? error.name : error)
    if (!error) this.describe('throw anything.', true)
    this.satisfy(function(expected){ try { expected() }
                                     catch(e) {
                                       return !error?         true
                                       :      error_p(e)?      error.name == e.name
                                       :      re_p(error)?     error.test(e)
                                       :      /* otherwise */  deep_equal(error, e) }})
})


Assertion.define('type'
, 'have type {:type}, got {:actual-type} instead.'
, function(type) {
    this.store('type', type)
    this.satisfy(function(expected){ var actual = /^[A-Z]/.test(type)?  class_of(expected)
                                                : /* otherwise */       typeof expected
                                     this.store('actual-type', actual)
                                     return type === actual }.bind(this))
})
