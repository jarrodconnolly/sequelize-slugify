/**
 * Copyright © 2015 Jarrod Connolly
 * All Rights Reserved.
 */

'use strict';

var slug = require('slug');
var _ = require('lodash');

var SequelizeSlugify = function() {};

SequelizeSlugify.prototype.slugifyModel = function(Model, slugOptions) {

    // takes the array of source fields from the model instance and builds the slug
    var slugifyFields = function (instance, slugOptions){
        var slugParts = _.map(slugOptions.source, function(slugSourceField) {
            return instance[slugSourceField];
        });
        return slug(slugParts.join(' '), {lower: true});
    };

    // callback that performs the slugification on the create/update callbacks
    var handleSlugify = function(instance, options, next) {

        // check if any of the fields used to build the slug have changed
        var changed = _.any(slugOptions.source, function (slugSourceField) {
            return instance.changed(slugSourceField);
        });

        // current slug value
        var slugValue = instance.slug;

        // if we dont have a slug yet or one of its fields have changed build a new slug
        if(!slugValue || changed) {
            slugValue = slugifyFields(instance, slugOptions);
        } else {
            instance.slug = slugValue;
            return next(null, instance);
        }

        // checks to make sure this slug is not already used
        // iterates through -1 -2 suffixes until it finds an unused slug
        Model.find({ where: { slug: slugValue } }).then( function(found) {
            if (found === null) {
                instance.slug = slugValue;
                return next(null, instance);
            } else {
                var count = 1;
                slugValue += '-';
                (function recursiveFindUniqueSlug() {
                    Model.find({ where: { slug: slugValue + count } })
                        .then( function(found) {
                            if (found === null) {
                                instance.slug = slugValue + count;
                                return next(null, instance);
                            } else {
                                count++;
                                recursiveFindUniqueSlug();
                            }
                        });
                })();
            }
        });
    };

    // attach model callbacks
    Model.beforeCreate('handleSlugify', handleSlugify);
    Model.beforeUpdate('handleSlugify', handleSlugify);
};

module.exports = new SequelizeSlugify();
