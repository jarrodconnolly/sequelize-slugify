# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.3.1](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.3.0...v1.3.1) (2020-11-14)

* Republish of 1.3.0

## [1.3.0](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.2.1...v1.3.0) (2020-11-14)


### Features

* change to using standard-version for releases ([d6d3d83](https://github.com/jarrodconnolly/sequelize-slugify/commit/d6d3d83eaddd92e18043374c8e3ddfe438a5e6ad))

### [1.2.1](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.2.0...v1.2.1) (2020-08-28)


### Bug Fixes

* Remove a superfluous unique check calling `findOne` when using `suffixSource` ([10fe7a2](https://github.com/jarrodconnolly/sequelize-slugify/commit/10fe7a24a6149b3510f85135b2023b3b4e62e6f1))

## [1.2.0](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.1.0...v1.2.0) (2020-08-28)


### Features

* Add `regenerateSlug` method to model to allow manual control of slug regeneration. ([1870be0](https://github.com/jarrodconnolly/sequelize-slugify/commit/1870be0dec7f401f8a079d30b76099f67fb6e8e9))

## [1.1.0](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.0.0...v1.1.0) (2020-08-27)


### Features

* Add transaction support. Passes transaction used by Models into the plugin. ([a1b726a](https://github.com/jarrodconnolly/sequelize-slugify/commit/a1b726a18c6053b398662b20e2f9f134186a39ce))

## [1.0.0](https://github.com/jarrodconnolly/sequelize-slugify/compare/v0.9.1...v1.0.0) (2020-08-26)


### ⚠ BREAKING CHANGES

* Drop Node.js 6 and 8, minimum version is 10
* Rename `incrementalReplacement` to `incrementalSeparator`

### Continuous Integration

* Move from Travis to GitHub Actions
* Run unit tests using PostgreSQL, MySQL and SQLite
* Add code coverage reporting

## [0.9.0] - 2019-12-18
- Added `incrementalReplacement` option to specify the slug counter separator
- Package upgrades for security warnings

## [0.8.0] - 2019-03-22
- Hook support for bulkCreate so slugs are added

## [0.7.0] - 2019-03-17
- Switch from using `Model.find` to `Model.findOne` for sequelize v5 deprecations
- Package upgrades for security warnings


## [0.6.1] - 2018-08-15

### Changed
- Switch from using `slug` to `sluglife` for slug generation
- Other general dependency updates

### Removed
- Removed dependency on Bluebird
- Removed dependency on lodash


## [0.5.0] - Before Changelog...
