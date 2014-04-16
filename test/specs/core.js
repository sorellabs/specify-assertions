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
var spec = require('hifive')();
var alright = require('../../lib');
var claire = require('claire');
var AssertionError = require('assertion-error');
// Aliases
var _ = alright;
var t = claire.data;
var forAll = claire.forAll;
// Specification
module.exports = spec('Core', function (it, spec$2) {
    spec$2('verify()', function (it$2) {
        it$2('Should succeed with true if the validation is a success.', function () {
            alright.verify(alright.equal(true)(_.verify(_.ok(true))));
        });
        it$2('Should fail with an exception if the validation is a succes.', function () {
            alright.verify(_.raise(AssertionError)(function () {
                _.verify(_.ok(false));
            }));
        });
    });
    spec$2('not()', function (it$2) {
        it$2('Should swap the validation values.', function () {
            var d = _.ok(true);
            alright.verify(alright.equal('Validation.Failure(true to not be ok)')(_.not(d).toString()));
            alright.verify(alright.equal(d.toString())(_.not(_.not(d)).toString()));
        });
    });
});