/// core.js --- The core of Noire assertions
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

var Base = require('boo').Base
var array_p = Array.isArray
var slice   = [].slice


var Assertion = Base.derive({
  init:
  function _init(value) {
    this._prelude     = 'to'
    this._message     = ''
    this._params      = {}
    this._times       = 100

    return this.expect(value) }


, store:
  function _store(key, value) {
    this._params[key] = value
    return this }


, expect:
  function _expect(value) {
    this._expectation = value
    this.store('expected', value)
    return this }


, describe:
  function _describe(message, overwrite) {
    if (this._message && !overwrite) return this

    this._message = message
    return this }


, message:
  function _message() {
    return format( 'Expected {:expected} ' + this._prelude + ' ' + this._message
                 , this._params )}


, define:
  function _define(name, description, property) {
    var matcher = function() { this.describe(description)
                               property.apply(this, arguments)
                               return this }

    name = array_p(name)?   name
         : /* otherwise */  [name]
    name.forEach(function(key){ this[key] = matcher }, this) }


, satisfy:
  function _satisfy(property) {
    this.store('‹satisfy:property›', property)
    this.describe('satisfy {:‹satisfy:property›}.')

    if (!this._test(property, this._expectation))
      throw make_error(this.message())

    return this }


, _test:
  function _test(property) {
    return property.apply(null, slice.call(arguments, 1)) }


, not:
  function _not() {
    var test = this._test

    this._prelude += ' not'
    this._test = function(){ return !test.apply(this, arguments) }
    return this }


, invoke:
  function _invoke(method) {
    var args = [].slice.call(arguments, 1)
    this.store('‹invoke:method›', method)
    this.store('‹invoke:args›', args)
    this._prelude = ', when invoking method {:‹invoke:method›} with '
                  + '{:‹invoke:args›} ' + this._prelude
    var test = this._test
    this._test = function(p){ this._expectation = this._expectation[method].apply(this._expectation, args)
                              this._message += ' Yielded {:‹invoke:result›} instead.'
                              this.store('‹invoke:result›', this._expectation)
                              return test.apply(this, [p, this._expectation]) }
    return this }


, all:
  function _all(generators) {
    var test   = this._test
    this._test = random_property_test
    return this

    function random_property_test(prop, expectation) {
      var ok    = true
      var times = 0
      var args, value

      while (ok && times++ < this._times) {
        args  = generators.map(function(v){ return v() })
        value = expectation.apply(null, args)
        ok    = test(prop, value) }

      this.store('‹all:times›', times)
      this.store('‹all:args›', args)
      this.store('‹all:result›', value)
      this._prelude  = ', given the arguments {:‹all:args›}, '
                     + this._prelude + ' yield values that will'
      this._message += '  Failed after {:‹all:times›} test(s) by yielding {:‹all:result›}'
      return ok }}
})


///// Function starts_with_p
// Does the `string' start with a given piece of text?
//
// starts_with_p :: String, String -> Bool
function starts_with_p(string, what) {
  return string.slice(0, what.length) == what }


///// Function format
// Evaluates a template, substituting the variables with respect to the
// environment provided by the given `mappings'.
//
// If a mapping is not given, we assume it to be empty, in which case
// the template variables are simply stripped away.
//
// A template variable is a special construct in the form:
//
//     :bnf:
//     <template-variable> ::= "{:" <any but "}"> "}"
//
// For example, provide a "Hello, world!" template, that adjusts to a
// given name, one could write:
//
//     format("Hello, {:subject}!", { subject: "world" })
//     // => "Hello, world!"
//
// A template variable can be escaped by placing a backslash between the
// open-curly braces and the colon, such that the construct would be
// output verbatim:
//
//     // Remember backslashes must be escaped inside Strings.
//     format("Hello, {\\:subject}", { subject: "world" })
//     // => "Hello, {\\:subject}"
//
//
// format :: String, { String -> String | (String... -> String) } -> String
function format(string, mappings) {
  mappings = mappings || {}
  return string.replace(/{(\\?:)([^}]+)}/g, resolve_identifier)

  function resolve_identifier(match, mod, key) {
    return starts_with_p(mod, '\\')?  '{:' + key + '}'
    :      key in mappings?           stringify(mappings[key])
    :      /* otherwise */            '' }}

function stringify(o) {
  return typeof o == 'function'?    o.name?          '[Function: ' + o.name + ']'
                                  : /* otherwise */  '`' + o.toString() + '`'
  :      /* otherwise */          JSON.stringify(o) }

function make_error(message) {
  var e = Error.call(Object.create(Error.prototype), message)
  e.name = 'AssertionError'
  return e }


function ensure(value) {
  return Assertion.make(value) }


module.exports = { ensure: ensure
                 , Assertion: Assertion

                 , internal: { make_error: make_error }
                 }