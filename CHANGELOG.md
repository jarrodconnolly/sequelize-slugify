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
