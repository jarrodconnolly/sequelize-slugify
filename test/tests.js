/**
 * Copyright © 2014 sequelize-slugify
 * All Rights Reserved.
 */

'use strict';

var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://jarrod:jarrod@localhost:5432/sequelize_slugify_test', {logging: false});
var SequalizeSlugify = require('../index');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

var User = sequelize.define('user', {
    slug: {
        type: Sequelize.STRING,
        unique: true
    },
    givenName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    familyName: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

describe('sequelize-slugify', function () {

    before(function () {
        return sequelize.sync({force: true});
    });

    describe('slugs', function () {
        it('should create a slug from a single field', function () {
            SequalizeSlugify.slugifyModel(User, {
                source: ['givenName']
            });
            return User.create({givenName: 'Firstname', familyName: 'Lastname'})
                .then(function (user) {
                    return expect(user.slug).to.equal('firstname');
                });
        });

        it('should create a slug from multiple fields', function () {
            SequalizeSlugify.slugifyModel(User, {
                source: ['givenName', 'familyName']
            });
            return User.create({givenName: 'John', familyName: 'Hancock'})
                .then(function (user) {
                    return expect(user.slug).to.equal('john-hancock');
                });
        });

        it('should increment slug suffix if it already exists', function () {
            SequalizeSlugify.slugifyModel(User, {
                source: ['givenName', 'familyName']
            });
            return User.create({givenName: 'Person', familyName: 'Robot'})
                .then(function () {
                    return User.create({givenName: 'Person', familyName: 'Robot'})
                        .then(function(user) {
                            return expect(user.slug).to.equal('person-robot-1');
                        });
                });
        });
    });

    after(function () {
        return sequelize.close();
    });
});
