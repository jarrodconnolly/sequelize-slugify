/**
 * Copyright © 2015 Jarrod Connolly
 * All Rights Reserved.
 */

'use strict';

const slug = require('sluglife');

class SequelizeSlugify {
  slugifyModel(model, options) {

    const DEFAULT_SLUG_OPTIONS = {
      lower: true
    };
    const DEFAULT_OPTIONS = {
      overwrite: true,
      column: 'slug',
      incrementalSeparator: '-',
      passTransaction: true,
      paranoid: true,
      bulkUpdate: false
    };

    const slugifyOptions = {...DEFAULT_OPTIONS, ...options};

    const handleSlugify = async function (instance, sequelizeOptions, forceGenerateSlug) {

      // check if any of the fields used to build the slug have changed
      const changed = slugifyOptions.source.some(function (slugSourceField) {
        return instance.changed(slugSourceField);
      });

      // if nothing change (new appears as changed)
      if(!forceGenerateSlug && !changed) {
        return instance;
      }

      // current slug value
      let slugValue = instance[slugColumn];

      // we had a slug, and overwrite is false.
      // return what we had
      // forceGenerateSlug bypasses and forces a regeneration
      if(slugValue && slugifyOptions.overwrite === false && forceGenerateSlug !== true) {
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
      ({suffixedSlug:slugValue, isUnique} = await addSourceSuffix(instance, slugValue, slugifyOptions.suffixSource, transaction));

      // if addSourceSuffix found unique we can return
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
        transaction: transaction,
        paranoid: options.paranoid
      });
      return result === null;
    };

    // optionally adding suffix's from other field values
    const addSourceSuffix = async function (instance, slugValue, suffixFields, transaction) {
      let suffixedSlug = slugValue;
      let isUnique = false;

      // return current slug if no suffix provided
      if (!suffixFields || !Array.isArray(suffixFields)) {
        return {suffixedSlug, isUnique};
      }

      for(let i = 0; i < suffixFields.length; i++) {
        // slugify one new section from suffixFields array
        const newSlugSection = slugifyFields(instance, [suffixFields[i]]);
        // if we got a value back append it
        if(newSlugSection) {
          suffixedSlug += `${slugifyOptions.incrementalSeparator}${newSlugSection}`;
        }
        // if the slug is now unique we can stop
        isUnique = await isUniqueSlug(suffixedSlug, transaction);
        if(isUnique) {
          break;
        }
      }
      return {suffixedSlug, isUnique};
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

    const handleBeforeBulkUpdate = function (sequelizeOptions) {
      sequelizeOptions.individualHooks = true;
    };
    const handleAfterBulkUpdate = function (sequelizeOptions) {
      sequelizeOptions.individualHooks = false;
    };

    model.prototype.regenerateSlug = function (transaction) {
      const sequelizeOptions = {
        transaction
      };
      return handleSlugify(this, sequelizeOptions, true);
    };

    // attach model callbacks
    model.addHook('beforeCreate', handleSlugify);
    model.addHook('beforeUpdate', handleSlugify);
    model.addHook('beforeBulkCreate', handleSlugifyBulkCreate);

    if(slugifyOptions.bulkUpdate === true) {
      model.addHook('beforeBulkUpdate', handleBeforeBulkUpdate);
      model.addHook('afterBulkUpdate', handleAfterBulkUpdate);
    }
  }
}

const instance = new SequelizeSlugify();
module.exports = instance;
module.exports.SequelizeSlugify = instance;
