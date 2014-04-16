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
 * Describes divergent expectations on assertions.
 *
 * @module lib/divergence
 */

// -- Dependencies -----------------------------------------------------
var boo   = require('boo')
var spice = require('spice')
var show  = require('util').inspect
var curry = require('core.lambda').curry


// -- Aliases ----------------------------------------------------------
var keys = Object.keys


// -- Helpers ----------------------------------------------------------

/**
 * Maps an object.
 *
 * @summary (α → β) → Object[α] → Object[β]
 */
map = curry(2, map)
function map(f, object) {
  return keys(object).reduce(function(result, key) {
                               result[key] = f(object[key])
                               return result
                             }, {})
}

/**
 * Constructs a divergent expectation constructor.
 *
 * @method
 * @summary String → Divergence
 */
exports.divergence = divergence
function divergence(message) {
  return Divergence.derive({
    toString: function() {
      return spice(message, map(show, this.data))
    }
  })
}

/**
 * Constructs a divergent with an inverse.
 *
 * @method
 * @summary String → String → Divergence
 */
exports.invertibleDivergence = curry(2, invertibleDivergence)
function invertibleDivergence(message, negatedMessage) {
  var divergence = Divergence.derive({
    inverse: function() {
      return negatedDivergence.make(this.data)
    }

  , toString: function() {
      return spice(message, map(show, this.data))
    }
  })

  var negatedDivergence = Divergence.derive({
    inverse: function() {
      return divergence.make(this.data)
    }

  , toString: function() {
      return spice(negatedMessage, map(show, this.data))
    }
  })

  return divergence
}

// -- Implementation ---------------------------------------------------

/**
 * Represents a failed expectation in an assertion.
 *
 * @namespace
 * @summary
 * boo.Base <| Divergence
 */
exports.Divergence = Divergence
var Divergence = boo.Base.derive({
  /**
   * Constructs a new instance of this object.
   *
   * @name make
   * @memberof module:lib/divergence.Divergence
   * @method
   * @summary Object → Divergence
   */
  init: function(a) {
    this.data = boo.merge(a)
  }

  /**
   * Clones this object without running the initialisation code.
   *
   * All properties of the given objects are merged into the new clone, from
   * left to right.
   *
   * @name derive
   * @memberof module:lib/divergence.Divergence
   * @method
   * @summary Object... → Divergence
   */

  /**
   * Inverses this expectation.
   *
   * @method
   * @name invert
   * @memberof module:lib/divergence.Divergence
   * @summary Void → Divergence         :: partial, throws
   */
, inverse: function() {
    throw new Error('This divergence doesn\'t have an inverse.')
  }

  /**
   * Returns a textual representation of the divergence.
   *
   * @method
   * @name toString
   * @memberof module:lib/divergence.Divergence
   * @summary Void → String
   */
, toString: function() {
    return '[object Divergence]'
  }
})
