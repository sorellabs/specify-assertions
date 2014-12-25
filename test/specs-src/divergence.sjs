var hifive  = require('hifive')
var $       = require('../../lib')
var _       = require('../../lib').divergence
var claire  = require('claire')
var show    = require('util').inspect

// Aliases
var spec   = hifive()
var t      = claire.data
var forAll = claire.forAll

hifive.Test.setTimeout(5000)

// Specification
module.exports = spec('Divergence', function(it, spec) {

  spec('divergence()', function(it) {

    it( 'Should make a divergence with the given message.'
      , forAll(t.Id).satisfy(function(a) {
          return _.divergence(a).make({}).toString() => a
        }).asTest())
 
    it( 'Should not be invertible'
      , forAll(t.Str).satisfy(function(a) {
          return function(){ _.divergence(a).inverse() } should $.raise(Error)
        }).asTest())

    it( 'Should format the string according to the template and data.'
       , function() {
           var d = _.divergence('{:a} == {:b}').make({ a: 'foo', b: ['qux', 1] });
           d.toString() => (show('foo') + ' == ' + show(['qux', 1]))
       })

  })

  spec('invertibleDivergence()', function(ti) {

    it( 'Should make a divergence and its inverse.'
      , forAll(t.Id, t.Id).satisfy(function(a, b) {
          var d = _.invertibleDivergence(a, b).make({});
          return (
            d.toString() => a,
            d.inverse().toString() => b,
            d.inverse().inverse() => d
          )
        }).asTest())

  })

})
