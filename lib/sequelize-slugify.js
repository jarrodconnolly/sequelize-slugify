/**
 * Copyright © 2015 Jarrod Connolly
 * All Rights Reserved.
 */

'use strict';

const slug = require('sluglife');

class SequelizeSlugify {
  static slugifyModel(model, options) {

    const DEFAULT_SLUG_OPTIONS = {
      lower: true
    };
    const DEFAULT_OPTIONS = {
      overwrite: true,
      column: 'slug',
      incrementalSeparator: '-',
      passTransaction: true
    };

    const slugifyOptions = {...DEFAULT_OPTIONS, ...options};

    const handleSlugify = async function (instance, sequelizeOptions) {

      // check if any of the fields used to build the slug have changed
      const changed = slugifyOptions.source.some(function (slugSourceField) {
        return instance.changed(slugSourceField);
      });

      // if nothing change (new appears as changed)
      if(!changed) {
        return instance;
      }

      // current slug value
      let slugValue = instance[slugColumn];

      // we had a slug, and overwrite is false. return what we had
      if(slugValue && slugifyOptions.overwrite === false) {
        return instance;
      }

      // either no slug, or we are overwriting. generate slug
      slugValue = slugifyFields(instance, slugifyOptions.source);

      // documented behaviour. Failure to slugify returns null
      if(slugValue === '') {
        instance[slugColumn] = null;
        return instance;
      }

      // obtain transaction if enabled
      const transaction = (slugifyOptions.passTransaction === true) ? sequelizeOptions.transaction : null;

      // determine if the slug is unique
      let isUnique = await isUniqueSlug(slugValue, transaction);
      if (isUnique) {
        instance[slugColumn] = slugValue;
        return instance;
      }

      // add on suffixes from the provided source suffixes
      slugValue = await addSourceSuffix(instance, slugValue, slugifyOptions.suffixSource, transaction);

      // determine if the slug is unique
      isUnique = await isUniqueSlug(slugValue, transaction);
      if (isUnique) {
        instance[slugColumn] = slugValue;
        return instance;
      }

      slugValue = await addNumericSuffix(slugValue, transaction);

      instance[slugColumn] = slugValue;
      return instance;
    };

    // Get the target column to place the slug in
    const slugColumn = slugifyOptions.column;

    // takes the array of source fields from the model instance
    // building the slug from the slug of the concatenated values
    const slugifyFields = function (instance, sourceFields) {
      const slugParts = sourceFields.map(function (slugSourceField) {
        return instance[slugSourceField];
      });

      const options = (slugifyOptions && slugifyOptions.slugOptions) || DEFAULT_SLUG_OPTIONS;
      return slug(slugParts.join(' '), options);
    };

    const isUniqueSlug = async function (slug, transaction) {
      const result = await model.findOne({
        where: {[slugColumn]: slug },
        transaction: transaction
      });
      return result === null;
    };

    // optionally adding suffix's from other field values
    const addSourceSuffix = async function (instance, slugValue, suffixFields, transaction) {
      // return current slug if no suffix provided
      if (!suffixFields || !Array.isArray(suffixFields)) {
        return slugValue;
      }

      let suffixedSlug = slugValue;
      for(let i = 0; i < suffixFields.length; i++) {
        // slugify one new section from suffixFields array
        const newSlugSection = slugifyFields(instance, [suffixFields[i]]);
        // if we got a value back append it
        if(newSlugSection) {
          suffixedSlug += `${slugifyOptions.incrementalSeparator}${newSlugSection}`;
        }
        // if the slug is now unique we can stop
        const foundUnique = await isUniqueSlug(suffixedSlug, transaction);
        if(foundUnique) {
          break;
        }
      }
      return suffixedSlug;
    };

    const addNumericSuffix = async function (slugValue, transaction) {
      let count = 1;
      let foundUnique = false;
      let suffixedSlug = '';
      while(!foundUnique) {
        suffixedSlug = `${slugValue}${slugifyOptions.incrementalSeparator}${count}`;
        foundUnique = await isUniqueSlug(suffixedSlug, transaction);
        count++;
      }
      return suffixedSlug;
    };

    const handleSlugifyBulkCreate = function (instances) {
      return Promise.all(instances.map(handleSlugify));
    };

    // attach model callbacks
    model.addHook('beforeCreate', handleSlugify);
    model.addHook('beforeUpdate', handleSlugify);
    //Model.addHook('beforeBulkUpdate', handleSlugifyBulk);
    model.addHook('beforeBulkCreate', handleSlugifyBulkCreate);
  }
}

module.exports = SequelizeSlugify;
