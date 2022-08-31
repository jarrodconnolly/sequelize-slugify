# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.6.2](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.6.1...v1.6.2) (2022-08-31)


### Bug Fixes

* change model parameter type to `ModelStatic` [typescript] ([#55](https://github.com/jarrodconnolly/sequelize-slugify/issues/55)) ([3c8b5ea](https://github.com/jarrodconnolly/sequelize-slugify/commit/3c8b5ea584e8cbead900e02f1a665e1483a4b6dd))

### [1.6.1](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.6.0...v1.6.1) (2022-05-04)


### Bug Fixes

* update missing `bulkUpdate` option in published types ([ba2785f](https://github.com/jarrodconnolly/sequelize-slugify/commit/ba2785fb5342ee9f0d9dfc03d3be864330363c8f))

## [1.6.0](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.5.0...v1.6.0) (2021-08-18)


### Features

* include ts types in npm package ([920e1c9](https://github.com/jarrodconnolly/sequelize-slugify/commit/920e1c96ee18cc71be6f5e5e2bbc4593d78d6bbd))

## [1.5.0](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.4.0...v1.5.0) (2021-03-06)


### Features

* support for optional bulk update slug regeneration ([b357502](https://github.com/jarrodconnolly/sequelize-slugify/commit/b35750284b3b1ce2a1fa56a637dbad6315c73ea9))

## [1.4.0](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.3.2...v1.4.0) (2021-02-07)


### Features

* add paranoid option for duplicate check ([7e664db](https://github.com/jarrodconnolly/sequelize-slugify/commit/7e664db5ba8cf394a70ef16e3d1c2d1e34b99564))

### [1.3.2](https://github.com/jarrodconnolly/sequelize-slugify/compare/v1.3.1...v1.3.2) (2021-01-01)


### Bug Fixes

* make forceGenerateSlug generate slug even if nothing changed ([c521275](https://github.com/jarrodconnolly/sequelize-slugify/commit/c521275832ee4043be9e808458ca45ac0ac41618))

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
