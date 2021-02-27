## Installation

Run the following command to install the NPM package.  
``` shell
npm install sequelize-slugify
```

This will make the plugin available for use on your Sequelize models.

#### Slug Field

You will need to add a field to your model to hold the slug value.

```javascript
slug: {
    type: DataTypes.STRING,
    unique: true
}
```

#### Usage
Sequelize Slugify exposes the method `slugifyModel(Model, options)`. This will attach the required lifecycle events to your model.

```javascript
SequelizeSlugify.slugifyModel(User, {source: ['name']});
```
