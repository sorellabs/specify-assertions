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


Assertion.define('same', 'to be {:actual}', function(actual) {
  this.store('actual', actual)
  this.satisfy(function(expected){ return expected === actual })})


Assertion.define('contains', 'to contain {:value}', function(value) {
  this.store('value', value)
  this.satisfy(function(expected){ return expected.indexOf(value) !== -1 })})


Assertion.define('ok', 'to be ok', function() {
  this.satisfy(function(expected){ return !!expected })})


Assertion.define('empty', 'to be empty', function() {
  this.satisfy(function(expected){ return array_p(expected)?  expected.length == 0
                                   :      /* otherwise */     keys(expected).length == 0 })})


Assertion.define(['above', '>'], 'to be above {:value}', function(value) {
  this.store('value', value)
  this.satisfy(function(expected){ return expected > value })})


Assertion.define(['below', '<'], 'to be below {:value}', function(value) {
  this.store('value', value)
  this.satisfy(function(expected){ return expected < value })})


Assertion.define('within', 'to be within {:lower} and {:upper}', function(lower, upper) {
  this.store('lower', lower)
  this.store('upper', upper)
  this.satisfy(function(expected){ return expected >= lower
                                   &&     expected <= upper })})