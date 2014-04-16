bin        = $(shell npm bin)
lsc        = $(bin)/lsc
browserify = $(bin)/browserify
jsdoc      = $(bin)/jsdoc
sjs        = $(bin)/sjs
uglify     = $(bin)/uglifyjs
VERSION    = $(shell node -e 'console.log(require("./package.json").version)')

TEST_DIR = test/specs
TEST_SRC = $(wildcard test/specs/*.sjs)
TEST_TGT = ${TEST_SRC:.sjs=.js}
BUNDLE   = alright

$(TEST_DIR)/%.js: $(TEST_DIR)/%.sjs
	$(sjs) --readable-names  \
	       --module ./macros \
	       --output $@       \
	       $<

dist:
	mkdir -p dist

dist/$(BUNDLE).umd.js: dist
	$(browserify) lib/index.js --standalone $(BUNDLE) > $@

dist/$(BUNDLE).umd.min.js: dist/$(BUNDLE).umd.js
	$(uglify) --mangle - < $^ > $@

# ----------------------------------------------------------------------
bundle: dist/$(BUNDLE).umd.js

minify: dist/$(BUNDLE).umd.min.js

documentation:
	$(jsdoc) --configure jsdoc.conf.json
	ABSPATH=$(shell cd "$(dirname "$0")"; pwd) $(MAKE) clean-docs

clean-docs:
	perl -pi -e "s?$$ABSPATH/??g" ./docs/api/*.html

clean:
	rm -rf dist build $(TEST_TGT)

test: $(TEST_TGT)
	node test/tap

package: documentation bundle minify
	mkdir -p dist/$(BUNDLE)-$(VERSION)
	cp -r docs dist/$(BUNDLE)-$(VERSION)
	cp -r lib dist/$(BUNDLE)-$(VERSION)
	cp dist/*.js dist/$(BUNDLE)-$(VERSION)
	cp package.json dist/$(BUNDLE)-$(VERSION)
	cp README.md dist/$(BUNDLE)-$(VERSION)
	cp LICENCE dist/$(BUNDLE)-$(VERSION)
	cd dist && tar -czf $(BUNDLE)-$(VERSION).tar.gz $(BUNDLE)-$(VERSION)

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
