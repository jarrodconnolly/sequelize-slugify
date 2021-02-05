# sequelize-slugify

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/jarrodconnolly/sequelize-slugify/Continuous%20Integration)
![Codecov](https://img.shields.io/codecov/c/github/jarrodconnolly/sequelize-slugify)
![npm](https://img.shields.io/npm/v/sequelize-slugify)
![npm](https://img.shields.io/npm/dw/sequelize-slugify)
![NPM](https://img.shields.io/npm/l/sequelize-slugify)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow)

`sequelize-slugify` is a model plugin for Sequelize that automatically creates and updates unique slugs for your models.

`sequelize-slugify` runs GitHub Actions CI tests against PostgreSQL, MySQL & SQLite.

`sequelize-slugify` follows Semantic Versioning and supports Node v10 and above.

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

slugifyModel takes an option object as it's second parameter.

```javascript
SequelizeSlugify.slugifyModel(User, {
    source: ['givenName'],
    suffixSource: [],
    slugOptions: { lower: true },
    overwrite: false,
    column: 'slug',
    incrementalSeparator: '-',
    passTransaction: true,
    paranoid: true
});
```
Available Options

- `source` - (Required) Array of field names in the model to build the slug from.
- `suffixSource` - (Optional)(Default `[]`) Array of field names in the model to use as the source for additional suffixes to make the slug unique (before defaulting to adding numbers to the end of the slug).
- `slugOptions` - (Optional)(Default `{lower: true}`) Pass additional options for slug generation as defined by [`sluglife`](https://github.com/jarrodconnolly/sluglife#options).
- `overwrite` - (Optional)(Default `true`) Change the slug if the source fields change once the slug has already been built.
- `column` - (Optional)(Default `slug`) Specify which column the slug is to be stored into in the model.
- `incrementalSeparator` - (Optional)(Default `-`) Specify the separator between the slug, and the duplicate count.
- `passTransaction` - (Optional)(Default `true`) Whether to pass an outer transaction, if one exists, to the plugin.
- `paranoid` - (Optional)(Default `true`) Whether the duplication check will use a paranoid query or not, for determining the next unique slug.

## Methods

The method `regenerateSlug` is attached to the models, this allows for manual slug regeneration when `overwrite`
is disabled. This allows for more controlled slug generation.

The `regenerateSlug` method takes an option argument `transaction` that can be passed in if you are calling from
within a Sequelize transaction.

## Usage Examples

### Basic Usage

```javascript

import SequelizeSlugify from 'sequelize-slugify';

export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
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
        },
    });

    SequelizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName']
    });

    return User;
};
```

### Suffix Sources

```javascript
import SequelizeSlugify from 'sequelize-slugify';

export default (sequelize, DataTypes) => {
    const Movie = sequelize.define('Movie', {
        slug: {
            type: DataTypes.STRING,
            unique: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        year: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    SequelizeSlugify.slugifyModel(Movie, {
        source: ['title'],
        suffixSource: ['year']
    });

    return Movie;
};

```

### Using getter functions as source

Using Sequelize `getterMethods` and `VIRTUAL` fields, you can derive slugs from any combination of model attributes using whatever custom logic you may need.

```javascript
import SequelizeSlugify from 'sequelize-slugify';

export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        email: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        emailAsSlug: {
            type: DataTypes.VIRTUAL,
            get() {
              return this.get('email') && this.get('email').split('@')[0].replace('.', '-');
            },
        },
    }, {
        getterMethods: {
          timestamp() {
            return Date.now();
          },
        }
    });

    SequelizeSlugify.slugifyModel(User, {
        source: ['emailAsSlug'],
        suffixSource: ['timestamp'],
    });

    return User;
};
```
## Transactions

A transaction wrapping operations on the Model will be passed by default to the internals of this plugin. 
This behaviour can be modified using the `passTransaction` option described above.

Internally this plugin only calls a `findOne` operation, passing the transaction to this may help in specific Isolation scenarios depending on your underlying database.

Fields modified when creating/updating the slug will be rolled back even if we do not pass the transaction due to the nature of how hooks operate.

