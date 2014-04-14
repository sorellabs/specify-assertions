bin        = $(shell npm bin)
lsc        = $(bin)/lsc
browserify = $(bin)/browserify
jsdoc      = $(bin)/jsdoc
uglify     = $(bin)/uglifyjs
VERSION    = $(shell node -e 'console.log(require("./package.json").version)')


dist:
	mkdir -p dist

dist/alright.umd.js: dist
	$(browserify) lib/index.js --standalone Alright > $@

dist/alright.umd.min.js: dist/alright.umd.js
	$(uglify) --mangle - < $^ > $@

# ----------------------------------------------------------------------
bundle: dist/alright.umd.js

minify: dist/alright.umd.min.js

documentation:
	$(jsdoc) --configure jsdoc.conf.json
	ABSPATH=$(shell cd "$(dirname "$0")"; pwd) $(MAKE) clean-docs

clean-docs:
	perl -pi -e "s?$$ABSPATH/??g" ./docs/*.html

clean:
	rm -rf dist build

test:
	$(lsc) test/tap.ls

package: documentation bundle minify
	mkdir -p dist/alright-$(VERSION)
	cp -r docs dist/alright-$(VERSION)
	cp -r lib dist/alright-$(VERSION)
	cp dist/*.js dist/alright-$(VERSION)
	cp package.json dist/alright-$(VERSION)
	cp README.md dist/alright-$(VERSION)
	cp LICENCE dist/alright-$(VERSION)
	cd dist && tar -czf alright-$(VERSION).tar.gz alright-$(VERSION)

publish: clean
	npm install
	npm publish

bump:
	node tools/bump-version.js $$VERSION_BUMP

bump-feature:
	VERSION_BUMP=FEATURE $(MAKE) bump

bump-major:
	VERSION_BUMP=MAJOR $(MAKE) bump

.PHONY: test bump bump-feature bump-major publish package clean documentation
