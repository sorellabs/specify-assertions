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
var hifive = require('hifive');
var claire = require('claire');
var k = require('core.lambda').constant;
var deepEq = require('deep-equal');
var extend = require('boo').extend;
var AssertionError = require('assertion-error');
var _ = require('../../lib');
// Aliases
var spec = hifive();
var t = claire.data;
var forAll = claire.forAll;
var classOf = Function.call.bind(Object.prototype.toString);
hifive.Test.setTimeout(5000);
// Data types
var Any = claire.sized(k(10), t.Any);
var List = function (a) {
    return claire.sized(k(10), t.Array(a));
};
var Map = function (a) {
    return claire.sized(k(10), t.Object(a));
};
var Errs = claire.label('Errs', claire.asGenerator(function () {
        return pick([
            TypeError,
            SyntaxError,
            RangeError,
            ReferenceError
        ]);
    }));
// Helpers
function notEmpty(as) {
    return as.length > 0;
}
function pick(as) {
    return as[Math.floor(Math.random() * as.length)];
}
function shuffle(a) {
    return a.sort(function (x, y) {
        return Math.random() - 0.5;
    });
}
// Specification
module.exports = spec('Validations', function (it, spec$2) {
    spec$2('assert()', function (it$2) {
        var divergence = _.divergence.Divergence;
        it$2('Should create a successful validation if the assertion is true.', function () {
            (function (alright) {
                return alright.verify(_.assert(true, divergence).isSuccess)(alright.equal(true));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
            (function (alright) {
                return alright.verify(_.assert(true, divergence).get())(alright.equal(divergence));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
        });
        it$2('Should create a failed validation if the assertion fails.', function () {
            (function (alright) {
                return alright.verify(_.assert(false, divergence).isFailure)(alright.equal(true));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
            (function (alright) {
                return alright.verify(_.assert(false, divergence).swap().get())(alright.equal(divergence));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
        });
    });
    it('equal(\u03B1, \u03B2) should succeed if \u03B1 and \u03B2 are structurally equal', forAll(Any, Any).satisfy(function (a, b) {
        return function (alright) {
            return alright.verify(_.equal(a)(a).isSuccess)(alright.equal(true));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright), function (alright) {
            return alright.verify(_.equal(b)(b).isSuccess)(alright.equal(true));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright), function (alright) {
            return alright.verify(_.equal(a)(b).isSuccess)(alright.equal(deepEq(a, b)));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
    }).asTest());
    it('ok(\u03B1) should succeed whenever \u03B1 is truthy', forAll(Any).satisfy(function (a) {
        return function (alright) {
            return alright.verify(_.ok(a).isSuccess)(alright.equal(!!a));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
    }).asTest());
    it('strictEqual(\u03B1, \u03B2) should succeed if \u03B1 and \u03B2 are strict equal', forAll(Any, Any).satisfy(function (a, b) {
        return function (alright) {
            return alright.verify(_.strictEqual(a)(a).isSuccess)(alright.equal(a === a));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright), function (alright) {
            return alright.verify(_.strictEqual(b)(b).isSuccess)(alright.equal(b === b));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright), function (alright) {
            return alright.verify(_.strictEqual(a)(b).isSuccess)(alright.equal(a === b));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
    }).asTest());
    it('haveType(\u03B1, \u03B2) should succeed whenever \u03B2 is of type \u03B1', forAll(Any).satisfy(function (a) {
        return function (alright) {
            return alright.verify(_.haveType(typeof a)(a).isSuccess)(alright.equal(true));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
    }).asTest());
    it('haveClass(\u03B1, \u03B2) should succeed whenever \u03B2 has class \u03B1', forAll(Any).satisfy(function (a) {
        return function (alright) {
            return alright.verify(_.haveClass(classOf(a).slice(8, -1))(a).isSuccess)(alright.equal(true));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
    }).asTest());
    it('contain(\u03B1, \u03B2) should succeed whenever \u03B2 contains \u03B1', forAll(List(Any)).given(notEmpty).satisfy(function (as) {
        return function (alright) {
            return alright.verify(_.contain(pick(as))(as).isSuccess)(alright.equal(true));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright), function (alright) {
            return alright.verify(_.contain({})(as).isFailure)(alright.equal(true));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
    }).asTest());
    it('match(\u03B1)(\u03B2) should succeed whenever \u03B1 successfully matches \u03B2', forAll(t.Str).satisfy(function (a) {
    }    // TODO
).asTest()).disable();
    it('have(\u03B1)(\u03B2) should succeed whenever \u03B2 has a property \u03B1', forAll(Map(t.Int), List(t.Id)).satisfy(function (a, bs) {
        var keys = shuffle(Object.keys(a).concat(bs));
        var key = pick(keys);
        return function (alright) {
            return alright.verify(_.have(key)(a).isSuccess)(alright.equal(key in a));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
    }).asTest());
    it('raise(\u03B1)(\u03B2) should succeed whenever \u03B2() throws \u03B1', forAll(Errs).satisfy(function (e) {
        return function (alright) {
            return alright.verify(function () {
                throw e('foo');
            })(_.raise(e));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright), function (alright) {
            return alright.verify(function () {
                throw e('foo');
            })(_.raise('foo'));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright), function (alright) {
            return alright.verify(function () {
                throw e('foo');
            })(_.raise(/oo/));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright), function (alright) {
            return alright.verify(function () {
                throw e('foo');
            })(alright.not(_.raise(AssertionError)));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright);
    }).asTest());
    it('inheritsFrom(\u03B1)(\u03B2) should succeed if \u03B1 is in the proto chain of \u03B2', function () {
        var a = {}, b = Object.create(a);
        (function (alright) {
            return alright.verify(b)(_.inheritFrom(a));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
        (function (alright) {
            return alright.verify(a)(alright.not(_.inheritFrom(b)));
        }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
    });
    spec$2('not()', function (it$2) {
        it$2('Should swap the validation values.', function () {
            (function (alright) {
                return alright.verify(_.not(_.ok, true).toString())(alright.equal('Validation.Failure(true to not be ok)'));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
            (function (alright) {
                return alright.verify(_.not(_.not(_.ok), true).toString())(alright.equal('Validation.Success(true to be ok)'));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('alright') : window.alright));
        });
    });
});