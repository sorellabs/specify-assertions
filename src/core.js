/// core.js --- The core of Frame assertions
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


var Assertion = Base.derive({
  init:
  function _init(value) {
    this._messages    = {}
    this._kind        = 'assertion'
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
  function _describe(message) {
    if (this._messages.assertion) return this
    
    this._messages.assertion  = 'Expected {:expected} to '     + message
    this._messages.refutation = 'Expected {:expected} to not ' + message
    return this }


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
    this.store('property', property.toString())
    this.describe('satisfy {:property}')

    if (!property(this._expectation))
      throw make_error(format(this._messages[this._kind], this._params))

    return this }


, not:
  function _not() {
    this._kind = 'refutation'
    return this }
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
    :      key in mappings?           JSON.stringify(mappings[key])
    :      /* otherwise */            '' }}


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