## Examples

#### Minimal
```javascript
import SequelizeSlugify from 'sequelize-slugify';

export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        slug: {
            type: DataTypes.STRING,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });

    SequelizeSlugify.slugifyModel(User, {
        source: ['name']
    });

    return User;
};
```

#### Suffix Sources

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
