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
            var value = instance[slugSourceField];
            for (var i = 0; i < slugOptions.ignoreStrings.length; i++) {
              value = value.split(slugOptions.ignoreStrings[i]).join('');
            }
            return value
        });
        return slug(slugParts.join(' '), {lower: true});
    };

    // callback that performs the slugification on the create/update callbacks
    var handleSlugify = function(instance, options, next) {

        // we overwrite slug value on source field changes by default
        if (typeof slugOptions.overwrite === 'undefined') {
            slugOptions.overwrite = true;
        }

        // ignoreStrings default: []
        if (typeof slugOptions.ignoreStrings === 'undefined') {
            slugOptions.ignoreStrings = [];
        }

        // check if any of the fields used to build the slug have changed
        var changed = _.any(slugOptions.source, function (slugSourceField) {
            return instance.changed(slugSourceField);
        });

        // current slug value
        var slugValue = instance.slug;

        // if we had no slug OR our slug changed and overwrite options is true
        // build a new slug
        if (!slugValue || (slugOptions.overwrite && changed)) {
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
