==================
 Discover Alright
==================

This document will guide you through the concepts behind Alright. After reading
this you'll understand how Alright works, and how you can extend it to meet
your needs, by providing new assertions or new ways of making assertions.


Overview
========

How do you make assertions composable and extensible? Well, definitely not by
throwing exceptions, since those require the use of special constructs for when
you don't want a failed assertion to terminate the process. Instead, Alright
uses two core concepts: ``Validations`` and ``Divergences``. They're derived from
the idea that when you make an assertion about the property of an object, you
have two different outcomes. Either the assertion succeeds, which is great, or
it fails, in which case you want to provide a detailed description of the
failure.

The ``Validation`` data structure captures the idea of an assertion either
succeeding or failing, whereas the ``Divergence`` data structure captures the
idea of providing a detailed description of the assertion. 

By using these data structures instead of directly using ``Exceptions`` and
throwing errors, we're not only able to compose assertions and provide support
for things like asynchronous assertions in a straight-forward manner, but we
can do this in a fairly high-level and easily extensible way.

This also means that assertion functions do only one job. They tell you whether
a property holds or not, and if not, tell you why it doesn't hold. For
example::

    // :: Number → Number → Validation[Divergence, Divergence]
    function greaterThan(a){ return function(b) {
      var message = invertibleDivergence( '{:b} to be greater than {:a}'
                                        , '{:b} to not be greater than {:a}'
                                        ).make({ a: a, b: b })

      return b > a?           Success(divergence)
      :      /* otherwise */  Failure(divergence)
    }}

    greaterThan(2)(3)
    // => Failure(Divergence("2 to be greater than 3"))

    greaterThan(3)(2)
    // => Success(Divergence("2 to be greater than 3"))

Another function can then determine what to do with the successful or failed
assertion, so it's possible to support asynchronous and synchronous assertions
in a fairly straight-forward manner, and even combine different assertions into
a single one.


The Divergence structure
========================

A ``Divergence`` is a structure that provides a description of an assertion. And
it's present to let the computations deal with such description at a high
level, which is something you can't do by using plain strings.

In a nutshell, a ``Divergence`` is any **immutable object** that implements the
following interface::

   type Divergence where
     data     :: { String → Any }
     toString :: Void → String
     inverse  :: Void → Divergence        (partial, throws)


``data`` is a property that contains the values that participated in the
assertion. By convention, an ``actual`` property stores the value being tested
in the assertion, and an ``expected`` property stores the expected outcome of
the test. Storing these values allows reporters (a testing framework, for
example) to provide things like *diffs* when presenting a failed assertion to
the user.

The usage of the ``toString()`` method is pretty straight-forward: it should
give you a plain-text description of the assertion. For example, if the
original assertion was ``2 > 3``, a ``Divergence.toString()`` for this
assertion would return ``"2 to be greater than 3"``.

Lastly, the ``inverse()`` method returns a new ``Divergence`` object, with the
same data, but that describes the negative version of the assertion. So, for an
assertion like ``2 > 3``, inverting it would give you the assertion ``!(2 > 3)``.


Creating your own divergences
-----------------------------

Alright considers anything that fulfils the aforementioned ``Divergence``
interface to be a valid ``Divergence``, the only other requirement is that you
should treat your object as **immutable**. While you could easily write your
own objects using object literals, Alright provides the functions
``divergence`` and ``invertibleDivergence`` to construct objects fulfilling
this interface for you.

``divergence`` is a function that takes in a template string in the format used
by `spice`_, and gives you a ``Divergence`` object that doesn't have an
inverse. ``invertibleDivergence`` takes two template strings and gives you a
``Divergence`` that has an inverse::

    var divergences = require('alright').divergence

    var d1 = divergences.divergence('{:a} to be greater than {:b}')
    var d2 = divergences.invertibleDivergence('{:a} to be greater than {:b}')

To construct a specific ``Divergence`` for an assertion, you'd use the ``make``
method to provide the values that were part of the assertion::

    var a = d1.make({ a: 1, b: 2 })
    var b = d2.make({ a: 3, b: 5 })

Finally, whenever you invoke the ``toString()`` method, the template variables
will be substituted by the provided values::

    a.toString()
    // => '1 to be greater than 2'
    b.toString()
    // => '3 to be greater than 5'


The Validation structure
========================

A ``Validation`` is data structure that can model two different cases: success
and failure. Alright uses it for defining the result of each validation
function. While any value fulfilling the interface below can be used, the
suggested implementation to use is the `Data.Validation`_ module.

.. code-block:: haskell

   type Validation[α, β] <: Applicative[β], Functor[β] where
     -- | Creates a validation containing successful value β
     of    :: β → Validation[α, β]

     -- | Applies the successful function to an applicative,
     --   but aggregates failures with a Semigroup.
     ap    :: (@Validation[α, β → γ], f:Applicative[_]) => [β] → f[γ]

     -- | Transforms a successful value.
     map   :: (@Validation[α, β]) => (β → γ) → Validation[α, γ]

     -- | Applies one function to each side of the validation.
     fold  :: (@Validation[α, β]) => (α → γ), (β → γ) → γ

     -- | Swaps the validation values.
     swap  :: (@Validation[α, β]) => Void → Validation[β, α]

     -- | Transforms both sides of the validation.
     bimap :: (@Validation[α, β]) => (α → γ), (β → δ) → Validation[γ, δ]
     
For more information on the ``Validation`` structure, you can read the `A Monad
In Practicality: First-Class Failures`_ blog post.


Assertions and inversions
=========================

An assertion in Alright is just a function from values to
``Validation[Divergence, Divergence]``. That is, it determines whether a
particular set of values is *valid* or not, according to that property. At the
lowest level, there's the built-in ``assert`` function, which takes a
``Boolean`` value and a ``Divergence`` explaining the property being asserted,
then returns the ``Validation`` describing whether the assertion was successful
or not.

As such, the easiest way of writing your own custom assertions is to use the
``assert`` function, which is, in fact, how all built-in assertions are
written. For example, if one was to write an assertion for values between a
specific range::

    var assert     = require('alright').assert
    var divergence = require('alright').divergence.invertibleDivergence

    // :: Number → Number → Number → Validation[Divergence, Divergence]
    function between(min){ return function(max){ return function(a) {
      return assert( a > min && a < max
                   , divergence( '{:a} to be between {:min} and {:max}'
                               , '{:a} to not be between {:min} and {:max}'
                               ).make({ a: a, min: min, max: max }))
    }}}

    between(2)(5)(3)
    // => Success(Divergence("3 to be between 2 and 5"))

Note that since these assertions will be partially applied, it's necessary to
curry them. An easy way of writing a curried function would be to use the
`Core.Lambda`_ module::

    var curry = require('core.lambda').curry

    // :: Number → Number → Number → Validation[Divergence, Divergence]
    between = curry(3, between)
    function between(min, max, a) {
      return assert( a > min && a < max
                   , divergence( '{:a} to be between {:min} and {:max}'
                               , '{:a} to not be between {:min} and {:max}'
                               ).make({ a: a, min: min, max: max }))
    }

    between(2, 5)(3)
    // => Success(Divergence("3 to be between 2 and 5"))
    
If one wants to check for the inverse of this property, that is, if something
is **not** between a certain range, it's not necessary to write a new
assertion. Given the role of ``Validation``s and ``Divergence``s in Alright,
inverting some assertion is rather straight forward, and is provided by the
built-in ``not`` function, although you could easily implement it yourself::

    // :: Validation[Divergence, Divergence] → Validation[Divergence, Divergence]
    function not(validation) {
      return validation.swap().bimap(invert, invert)

      function invert(divergence){ return divergence.inverse() }
    }

    not(between(2, 5)(3))
    // => Failure(Divergence("3 to not be between 2 and 5"))


Verifying assertions
====================

Up until now there have been no effects in any of the assertions we've
made. While this did allow us to easily compose and abstract over these
computations to provide a simple basis for making assertions, they're not as
useful for testing. This is where *verification* comes in.

By separating the assertions from their verification, Alright allows different
verification strategies to be easily built on top of the existing assertions,
without having to change anything. This way Alright supports synchronous
assertions for testing frameworks that expect errors to be thrown, testing
frameworks that expect specific functions to be called, or even asynchronous
assertions using promises or any other concept.

Alright ships out of the box with support for synchronous assertions by
throwing errors when expectations aren't met, and asynchronous assertions for
`Promises/A+`_, `Fantasy-Land monads`_, and `monadic futures`_.

The ``verify`` function is used for synchronous assertions, and should work with
any testing library that expects exceptions to be thrown to invalidate the
test::

    describe('Equality', function() {
      it('Should fail', function() {
        alright.verify(3, _.equals(2))
        // => AssertionError('Expected 3 to structurally equal 2')
      })
    })


The ``verifyPromise`` function is used for asynchronous assertions, when the
testing library expects Promises/A+ values to be returned from the testing
function. `Mocha`_ and other libraries/frameworks support this::

    describe('Equality', function() {
      it('Should fail', function() {
        return alright.verifyPromise(Promise.of(3), _.equals(2))
        // => Promise(AssertionError('Expected 3 to structurally equal 2'))
      })
    })

Likewise, the ``verifyMonad`` and ``verifyFuture`` functions are used for
asynchronous assertions when the testing library expects Monads or Futures to
be returned from the testing function. These will be supported in the next
version of the `Hi-Five`_ testing library.


Macros
======





.. _spice: https://github.com/robotlolita/spice#formatstring-mappings
.. _Data.Validation: https://github.com/folktale/data.validation
.. _`A Monad In Practicality: First-Class Failures`: http://robotlolita.github.io/2013/12/08/a-monad-in-practicality-first-class-failures.html
.. _Core.Lambda: https://github.com/folktale/core.lambda
.. _Promises/A+: http://promises-aplus.github.io/promises-spec/
.. _Fantasy-Land monads: https://github.com/fantasyland/fantasy-land
.. _monadic futures: https://github.com/folktale/data.future
.. _Mocha: http://visionmedia.github.io/mocha/
.. _Hi-Five: https://github.com/hifivejs/hifive
