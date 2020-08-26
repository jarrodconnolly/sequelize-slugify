# sequelize-slugify

![](https://badgen.net/github/checks/jarrodconnolly/sequelize-slugify/master?label=CI&icon=github)
![](https://badgen.net/codecov/c/github/jarrodconnolly/sequelize-slugify/master?icon=codecov)
![](https://badgen.net/npm/v/sequelize-slugify)
![](https://badgen.net/npm/dw/sequelize-slugify)
![](https://badgen.net/github/license/jarrodconnolly/sequelize-slugify)


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
});
```
Available Options

- `source` - (Required) Array of field names in the model to build the slug from.
- `suffixSource` - (Optional)(Default `[]`) Array of field names in the model to use as the source for additional suffixes to make the slug unique (before defaulting to adding numbers to the end of the slug).
- `slugOptions` - (Optional)(Default `{lower: true}`) Pass additional options for slug generation as defined by [`sluglife`](https://github.com/jarrodconnolly/sluglife#options).
- `overwrite` - (Optional)(Default `true`) Change the slug if the source fields change once the slug has already been built.
- `column` - (Optional)(Default `slug`) Specify which column the slug is to be stored into in the model.
- `incrementalSeparator` - (Default `-`) Specify the separator between the slug, and the duplicate count.

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
