var hifive = require('hifive');
var claire = require('claire');
var AssertionError = require('assertion-error');
var _ = require('../../lib');
var pinky = require('pinky');
var Future = require('data.future');
var identity = require('core.lambda').identity;
// Aliases
var spec = hifive();
var t = claire.data;
var forAll = claire.forAll;
hifive.Test.setTimeout(5000);
function checkFailure(p) {
    return p.then(function (a) {
        throw AssertionError(a);
    }, function (e) {
        return e;
    });
}
function fromMonad(m) {
    return m.chain(function (a) {
        var p = pinky();
        return m.of(a.fold(p.reject.bind(p), p.fulfill.bind(p)));
    }).fork(identity, identity);
}
function fromFuture(f) {
    var p = pinky();
    return f.fork(p.reject.bind(p), p.fulfill.bind(p));
}
// Specification
module.exports = spec('Core', function (it, spec$2) {
    spec$2('verify()', function (it$2) {
        it$2('Should succeed with true if the validation is a success.', function () {
            (function (alright) {
                return alright.verify(_.verify(true, _.ok).toString())(alright.equal('true to be ok'));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions));
        });
        it$2('Should fail with an exception if the validation is a succes.', function () {
            (function (alright) {
                return alright.verify(function () {
                    _.verify(false, _.ok);
                })(_.raise(AssertionError));
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions));
        });
    });
    spec$2('verifyPromise()', function (it$2) {
        it$2('Should succeed with true if the validation is a success.', function () {
            return function (alright) {
                return alright.verifyPromise(_.verifyPromise(pinky(true), _.ok))(_.ok);
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions);
        });
        it$2('Should fail with an exception if the validation is a succes.', function () {
            return checkFailure(_.verifyPromise(pinky(false), _.ok));
        });
    });
    spec$2('verifyMonad()', function (it$2) {
        it$2('Should succeed with true if the validation is a success.', function () {
            return function (alright) {
                return alright.verifyPromise(fromMonad(_.verifyMonad(Future.of(true), _.ok)))(_.ok);
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions);
        });
        it$2('Should fail with an exception if the validation is a succes.', function () {
            return checkFailure(fromMonad(_.verifyMonad(Future.of(false), _.ok)));
        });
    });
    spec$2('verifyFuture()', function (it$2) {
        it$2('Should succeed with true if the validation is a success.', function () {
            return function (alright) {
                return alright.verifyPromise(fromFuture(_.verifyFuture(Future.of(true), _.ok)))(_.ok);
            }(typeof module !== 'undefined' && typeof require !== 'undefined' ? require('specify-assertions') : window.Specify.Assertions);
        });
        it$2('Should fail with an exception if the validation is a succes.', function () {
            return checkFailure(fromFuture(_.verifyFuture(Future.of(false), _.ok)));
        });
    });
});