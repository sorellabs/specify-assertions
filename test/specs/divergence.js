var hifive = require('hifive');
var $ = require('../../lib');
var _ = require('../../lib').divergence;
var claire = require('claire');
var show = require('util').inspect;
// Aliases
var spec = hifive();
var t = claire.data;
var forAll = claire.forAll;
hifive.Test.setTimeout(5000);
// Specification
module.exports = spec('Divergence', function (it, spec$2) {
    spec$2('divergence()', function (it$2) {
        it$2('Should make a divergence with the given message.', forAll(t.Id).satisfy(function (a) {
            return function (alright) {
                return alright.verify(_.divergence(a).make({}).toString())(alright.equal(a));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions);
        }).asTest());
        it$2('Should not be invertible', forAll(t.Str).satisfy(function (a) {
            return function (alright) {
                return alright.verify(function () {
                    _.divergence(a).inverse();
                })($.raise(Error));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions);
        }).asTest());
        it$2('Should format the string according to the template and data.', function () {
            var d = _.divergence('{:a} == {:b}').make({
                    a: 'foo',
                    b: [
                        'qux',
                        1
                    ]
                });
            (function (alright) {
                return alright.verify(d.toString())(alright.equal(show('foo') + ' == ' + show([
                    'qux',
                    1
                ])));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions));
        });
    });
    spec$2('invertibleDivergence()', function (ti) {
        it('Should make a divergence and its inverse.', forAll(t.Id, t.Id).satisfy(function (a, b) {
            var d = _.invertibleDivergence(a, b).make({});
            return function (alright) {
                return alright.verify(d.toString())(alright.equal(a));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions), function (alright) {
                return alright.verify(d.inverse().toString())(alright.equal(b));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions), function (alright) {
                return alright.verify(d.inverse().inverse())(alright.equal(d));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions);
        }).asTest());
    });
});