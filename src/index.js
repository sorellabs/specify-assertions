// # Module alright
//
// Beautiful assertions without any verbosity!
//
//
// Copyright (c) 2013 Quildreen "Sorella" Motta <quildreen@gmail.com>
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


// -- Dependencies -----------------------------------------------------
var boo      = require('boo')
var flaw     = require('flaw')
var parse    = require('esprima').parse
var generate = require('escodegen').generate
var λ        = require('athena')


// -- Aliases ----------------------------------------------------------
var keys    = Object.keys
var isArray = Array.isArray

// -- Assertion primitives ---------------------------------------------
var AssertionError = flaw('AssertionError')

function is(condition, message, options) {
  if (!condition)  throw AssertionError(message, options) }

function isnt(condition, message, options) {
  is(!condition, message, options) }


// -- Macro expansion --------------------------------------------------
function compile(f) {
  var source = '(' + f.toString() + ')()'
  return new Function('alright', generate(transform(source)))({ is: is }) }

function transform(source) {
  var ast = parse(source, { raw: true, loc: true })
  return mapTree(rewriteAssertions, ast) }

mapTree = λ.curry(2, mapTree)
function mapTree(f, node) {
  if (!(Object(node) === node))  return node

  var result = {}
  keys(node).forEach(function(key) {
    var child = node[key]

    isArray(child)?    result[key] = child.map(mapTree(f))
    : /* otherwise */  result[key] = mapTree(f, child) })

  return f(result) }

function rewriteAssertions(node) {
  return !isAssertion(node)?  node
  :      /* otherwise */      makeAssertion(node) }

function makeAssertion(node) {
  var callee     = node.callee
  var expression = node.arguments[0]
  var line       = callee.line
  var column     = callee.column

  return { type: 'CallExpression'
         , callee: { type: 'MemberExpression'
                   , computed: false
                   , object: { type: 'Identifier'
                             , name: 'alright'
                             , loc: callee.loc }
                   , property: { type: 'Identifier'
                               , name: 'is'
                               , loc: { line: line
                                      , column: column + 'alright.'.length }
                               , loc: callee.loc }}
         , arguments: [ expression
                      , stringify(expression) ]}}

function stringify(node) {
  return { type: 'Literal', value: generate(node) }}

function isAssertion(node) {
  return node.type === 'CallExpression'
  &&     node.callee.type === 'Identifier'
  &&     node.callee.name === 'alright' }

// -- Exports ----------------------------------------------------------
module.exports = { is             : is
                 , isnt           : isnt
                 , compile        : compile
                 , AssertionError : AssertionError
                 }