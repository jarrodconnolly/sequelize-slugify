## Options

`slugifyModel()` takes an option object as the second parameter.

### Example

```javascript
SequelizeSlugify.slugifyModel(User, {
    source: ['givenName'],
    suffixSource: [],
    slugOptions: { lower: true },
    overwrite: false,
    column: 'slug',
    incrementalSeparator: '-',
    passTransaction: true,
    paranoid: true,
    bulkUpdate: false
});
```
### Available Options
| Parameter              | Type | Required | Default | Description |
| ---                    | ---  | ---      | ---     | ---         |
| `source`               | `[]` | ✓        |         | Array of field names in the model to build the slug from
| `suffixSource`         | `[]` |          |         | Array of field names to use as the source for additional suffixes (before adding incrementing numbers) |
| `slugOptions`          | `{}` |          | `{lower:true}` | Pass additional options for slug generation as defined by [`sluglife`][SL] |
| `overwrite`            | `boolean` |     | `true` | Update the slug if the source fields change after initial generation |
| `column`               | `string` |      | `slug` | Specify the column to store the slug value |
| `incrementalSeparator` | `string` |      | `-`    | Specify the separator between the slug, and the duplicate count |
| `passTransaction`      | `boolean` |     | `true` | Pass the current transaction object in to the plugin |
| `paranoid`             | `boolean` |     | `true` | Whether the duplication check will use a paranoid query or not, for determining the next unique slug. |
| `bulkUpdate`           | `boolean` |     | `false` | Automatically enable `individualHooks` during bulk updates. Read the following information: [Note-1][N1] [Note-2][N2] |


[SL]: https://github.com/jarrodconnolly/sluglife#options "Slug Life Options"
[N1]: https://sequelize.org/master/manual/hooks.html#model-hooks "individualHooks Note 1"
[N2]: https://sequelize.org/master/manual/hooks.html#many-to-many-associations "individualHooks Node 2"
