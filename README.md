### Giphy-Cloud
Giphy Soundcloud mashup made with Express/React.
[See it live][GiphyCloud]

## Table of Contents
* [Quickstart](#quickstart)
* [Tests](#tests)

## Quickstart
```
git clone https://github.com/nezaj/giphycloud giphy-cloud
cd giphy-cloud
npm install
make build
make dev-server // Start express server
make dev-client // Start webpack server
open http://localhost:8080
```

### Tests
```
# Run eslint
make lint

# Run tests
make test

# Run lint and tests in one go
make check
```

### Deploy
Previously this was hosted on heroku but now uses gh-pages (one less tool to install)
```
make deploy
```

[GiphyCloud]: http://nezaj.github.io/giphycloud/
