# compiLESS

[![Build Status](https://magnum.travis-ci.com/ExPHAT/compiless.svg?token=pkSoYQq6oTsthGL4pZ6z)](https://magnum.travis-ci.com/ExPHAT/compiless)
[![NPM version](https://badge.fury.io/js/compiless.svg)](https://npmjs.org/package/compiless)

Compiles LESS files throughout a directory tree and exports them to a specific directory.

## Usage

Install the package

```shell
$ npm install compiless
```

Then in some file that is called upon app start (should only be called once):

```js
import compiless from "compiless";

async main() {
	await compiless(__dirname, {
	  "./src/less": "./public/css"
	});

	// Rest of your app code here
}
```

Or, you can choose to not use async/await:

```js
import compiless from "compiless";

function main() {
	compiless(__dirname, {
		"./src/less": "./public/css"
	}).then(function() {
		// Do something here!
	});
}
```

This will take any LESS files from the `src/less` directory, compile them, and export them to the `public/css` directory. So that they can be statically served.

## Important notes

- Found directories will be recursively searched.
- If a directory does not exist, it will be created.
- Previous files at a path **WILL** be overwritten

## Running tests

Clone this repo

```shell
$ git clone https://github.com/exPHAT/compiless.git
```

Install all of the dependencies

```shell
$ npm install
```

Build & run the tests

```shell
$ npm test
```

Build the project on its own

```shell
$ npm run build
```
