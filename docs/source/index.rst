Alright —at a glance—
=====================

Alright is a library for asserting particular properties about data in
JavaScript. The common use for this kind of thing is automated testing (TDD,
BDD, etc), and Alright can be used with most popular testing frameworks with
pluggable assertions, such as `Mocha`_.


.. rst-class:: overview-list

Guides
------

.. hlist::
   :columns: 2

   * :doc:`Getting Started <quickstart/index>`
       A lighting introduction to Alright, so you can jump straight to
       testing.

   * :doc:`Discover Alright <user/index>`
       A thorough tour of Alright's concepts, so you can understand how to best
       use it for testing your projects, and extend it with new assertions.

   * :doc:`Contributing <dev/index>`
       All you need to know to contribute to the Alright library!

   * `API Reference`_
       A quick reference of Alright's API, including usage examples.

.. toctree::
   :hidden:
   
   quickstart/index
   user/index
   dev/index


.. index:: platform support

Platform Support
----------------

Alright runs on all ECMAScript 5-compliant platforms without problems. It's
been successfully tested in the following platforms:

.. raw:: html

   <ul class="platform-support">
     <li class="ie">8.0+</li>
     <li class="safari">5.1</li>
     <li class="firefox">15.0+</li>
     <li class="opera">10.0+</li>
     <li class="chrome">21.0+</li>
     <li class="nodejs">0.6+</li>
   </ul>

For legacy, ES3 platforms, like IE's JScript, you'll have to provide user-land
implementations of the ES5 methods. You can do so by just including the
`es5-shim`_ library.


.. index:: support, tracker, issues

Support
-------

Alright uses the `Github tracker`_ for tracking bugs and new features.


.. index:: licence, license

Licence
-------

MIT/X11.

.. _Github tracker: https://github.com/robotlolita/alright/issues
.. _es5-shim: https://github.com/kriskowal/es5-shim
.. _API Reference: _static/api/index.html
.. _Mocha: http://visionmedia.github.io/mocha/
