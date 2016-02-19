# sequelize-slugify

[![Build Status](https://travis-ci.org/jarrodconnolly/sequelize-slugify.svg?branch=master)](https://travis-ci.org/jarrodconnolly/sequelize-slugify) [![npm](https://img.shields.io/npm/v/sequelize-slugify.svg)](https://www.npmjs.com/package/sequelize-slugify) [![Dependency Status](https://david-dm.org/jarrodconnolly/sequelize-slugify.svg)](https://david-dm.org/jarrodconnolly/sequelize-slugify) [![Code Climate](https://codeclimate.com/github/jarrodconnolly/sequelize-slugify/badges/gpa.svg)](https://codeclimate.com/github/jarrodconnolly/sequelize-slugify) ![GitHub license](https://img.shields.io/github/license/jarrodconnolly/sequelize-slugify.svg)

sequelize-slugify is a model plugin for Sequelize that automatically creates and updates unique slugs for your models.

So far this module has only been tested with the PostgreSQL database.

## Installation

`npm install sequelize-slugify`

## Requirements

You must place a slug field on your model something like this.

```javascript
slug: {
    type: DataTypes.STRING,
    unique: true
}
```
## Options

slugifyModel takes an options array as it's second parameter.

```javascript
SequalizeSlugify.slugifyModel(User, {
    source: ['givenName'],
    overwrite: false,
    ignoreStrings: ['_']
});
```
Avaliable Options

- `source` - (Required) Array of field names in the model to build the slug from
- `overwrite` = (Default TRUE) Change the slug if the source fields change once the slug has already been built
- `ignoreStrings` = (Default []) Before creating the slug this strings will be ignored in all sources

## Usage Example

```javascript

var SequalizeSlugify = require('sequelize-slugify');

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
            slug: {
                type: DataTypes.STRING,
                unique: true
            },
            emailAddress: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            givenName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            familyName: {
                type: DataTypes.STRING,
                allowNull: false
            }
        });

    SequalizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName']
    });

    return User;
};

```
