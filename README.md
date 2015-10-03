compiLESS
=========
[![Build Status](https://magnum.travis-ci.com/ExPHAT/compiless.svg?token=pkSoYQq6oTsthGL4pZ6z)](https://magnum.travis-ci.com/ExPHAT/compiless)
[![NPM version](https://badge.fury.io/js/compiless.svg)](https://npmjs.org/package/compiless)

Compiles LESS files throughout a directory tree and exports them to a specific directory.


Usage
-----
Install required dependencies
```shell
$ npm install
```

Then in some file that is called upon app start (should only be called once):
```js
require("compiless")(__dirname, {
  "./src/less": "./public/css"
});
```

This will take any LESS files from the `src/less` directory, compile them, and export them to the `public/css` directory. So that they can be statically served.


Important notes
---------------
* Found directories will be recursivly searched.
* If a directory does not exist, it will be created.
* Previous files at a path **WILL** be overwritten


Running tests
-------------
Ensure you have mocha installed.

```shell
$ npm test
```
