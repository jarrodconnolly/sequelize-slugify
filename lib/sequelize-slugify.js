/**
 * Copyright © 2015 Jarrod Connolly
 * All Rights Reserved.
 */

'use strict';

var slug = require('slug');
var _ = require('lodash');

var SequelizeSlugify = function() {};

SequelizeSlugify.prototype.slugifyModel = function(Model, slugOptions) {

    var slugify = function (instance, slugOptions){
        var slugParts = _.map(slugOptions.source, function(slugSourceField) {
            return instance[slugSourceField];
        });
        return slug(slugParts.join(' '));
    };

    var handleSlugify = function(instance, options, next) {

        var changed = _.any(slugOptions.source, function (slugSourceField) {
            return instance.changed(slugSourceField);
        });

        var slugValue = instance.slug;

        if(!slugValue || changed) {
            slugValue = slugify(instance, slugOptions);
        }

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

    Model.beforeCreate('handleSlugify', handleSlugify);
    Model.beforeUpdate('handleSlugify', handleSlugify);
};

module.exports = new SequelizeSlugify();
