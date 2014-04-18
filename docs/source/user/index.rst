==================
 Discover Alright
==================

This document will guide you through the concepts behind Alright. After reading
this you'll understand how Alright works, and how you can extend it to meet
your needs, by providing new assertions or new ways of making assertions.


Divergences and Validations
===========================

How do you make assertions composable and extensible? Well, definitely not by
throwing exceptions, since those require the use of special constructs for when
you don't want a failed assertion to terminate the process. Instead, Alright
uses two core concepts: `Validations` and `Divergences`. They're derived from
the idea that when you make an assertion about the property of an object, you
have two different outcomes. Either the assertion succeeds, or it fails, in
which case you want to provide a detailed description of the failure.

The `Validation` data structure captures the idea of an assertion either
succeeding or failing, whereas the `Divergence` data structure captures the
idea of providing a detailed description of the failure. 

By using these data structures instead of directly using `Exceptions` and
throwing errors, we're not only able to compose assertions and provide support
for things like asynchronous assertions in a straight-forward manner, but we
can do this in a fairly high-level and easily extensible way.

This also means that assertion functions do only one job. They tell you whether
a property holds or not, and if not, tell you why it doesn't hold. For
example::

    // :: Number → Number → Validation[Divergence, Divergence]
    function greaterThan(a){ return function(b) {
      var message = divergence( '{:b} to be greater than {:a}'
                              , '{:b} to not be greater than {:a}'
                              ).make({ a: a, b: b })

      return b > a?           Success(divergence)
      :      /* otherwise */  Failure(divergence)
    }}



