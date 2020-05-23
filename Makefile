MAKEFLAGS = --no-print-directory --always-make --silent
MAKE = make $(MAKEFLAGS)

NODE_BIN = node_modules/.bin
NODE = $(NODE_BIN)/babel-node
NODEMON = $(NODE_BIN)/nodemon
PUBLIC_DIR = public

.PHONY: \
	build \
	dev dev-client dev-server prod-server \
	check lint test \
	test-watch \
	deploy

build:
	@echo "Building project..."
	$(NODE_BIN)/webpack

dev:
	$(MAKE) dev-client & $(MAKE) dev-server

dev-client:
	@echo "Starting client dev-server..."
	$(NODE_BIN)/webpack-dev-server \
		--progress --colors \
		--hot --inline \
		--content-base public \
		--history-api-fallback

dev-server:
	@echo "Starting backend dev-server..."
	$(NODEMON) --exec $(NODE) --harmony -- src/server/index.js

prod-server:
	@echo "Starting prod server..."
	$(NODE) --harmony -- src/server/index.js

check:
	$(MAKE) lint
	$(MAKE) test
	@echo "Hooray! -- All checks pass"

lint:
	@echo "Running eslint..."
	$(NODE_BIN)/eslint --ext .js --ext .jsx src
	$(NODE_BIN)/eslint test

test:
	@echo "Running tests..."
	$(NODE_BIN)/mocha 'test/**/*.@(js|jsx)'

test-watch:
	@echo "Watching tests..."
	$(NODE_BIN)/mocha 'test/**/*.@(js|jsx)' --watch --reporter min

deploy:
	@echo "Deploying to gh-pages..."
	$(MAKE) build
	git checkout -B gh-pages
	git add -f $(PUBLIC_DIR)
	git commit -am "Rebuild website"
	git filter-branch -f --prune-empty --subdirectory-filter $(PUBLIC_DIR)
	git push -f origin gh-pages
	git checkout -
