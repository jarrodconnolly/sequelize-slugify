/**
 * Copyright © 2014 sequelize-slugify
 * All Rights Reserved.
 */

'use strict';

var Sequelize = require('sequelize');

var dbUsername = process.env.DB_USER || 'postgres';
var dbPassword = process.env.DB_PW || null;
var sequelize = new Sequelize('sequelize_slugify_test', dbUsername, dbPassword, {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
});

var SequalizeSlugify = require('../index');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var expect = chai.expect;

var GetUser = function(modelname) {
    return sequelize.define(modelname, {
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
};

var User = {};
var userId = 0;
describe('sequelize-slugify', function () {

    describe('slugs', function () {

        // user a new model for each test
        beforeEach(function () {
            User = GetUser('user' + userId);
            userId++;
            return sequelize.sync({force: true});
        });

        it('should create a slug from a single field', function () {
            SequalizeSlugify.slugifyModel(User, {
                source: ['givenName']
            });
            return User.create({givenName: 'Suzan', familyName: 'Scheiber'})
                .then(function (user) {
                    return expect(user.slug).to.equal('suzan');
                });
        });

        it('should create a slug from multiple fields', function () {
            SequalizeSlugify.slugifyModel(User, {
                source: ['givenName', 'familyName']
            });
            return User.create({givenName: 'Ernesto', familyName: 'Elsass'})
                .then(function (user) {
                    return expect(user.slug).to.equal('ernesto-elsass');
                });
        });

        it('should increment slug suffix if it already exists', function () {
            SequalizeSlugify.slugifyModel(User, {
                source: ['givenName', 'familyName']
            });
            return User.create({givenName: 'Cleora', familyName: 'Curley'})
                .then(function () {
                    return User.create({givenName: 'Cleora', familyName: 'Curley'})
                        .then(function(user) {
                            return expect(user.slug).to.equal('cleora-curley-1');
                        });
                });
        });

        it('should overwrite slug by default', function () {
            SequalizeSlugify.slugifyModel(User, {
                source: ['givenName']
            });
            return User.create({givenName: 'Rupert', familyName: 'Rinaldi'})
                .then(function (user) {
                    user.givenName = 'Genie';
                    user.familyName = 'Gayden';
                    return user.save()
                        .then(function(updatedUser) {
                            return expect(updatedUser.slug).to.equal('genie');
                        });
                });
        });

        it('should NOT overwrite slug if option says not to', function () {
            SequalizeSlugify.slugifyModel(User, {
                source: ['givenName'],
                overwrite: false
            });
            return User.create({givenName: 'Miquel', familyName: 'Mceachin'})
                .then(function (user) {
                    user.givenName = 'Sallie';
                    user.familyName = 'Shira';
                    return user.save()
                        .then(function(updatedUser) {
                            return expect(updatedUser.slug).to.equal('miquel');
                        });
                });
        });
        it("Slug should NOT contain ' in slug", function () {
            SequalizeSlugify.slugifyModel(User, {
                source: ['familyName'],
                ignoreStrings: ['_']
            });
            return User.create({givenName: 'Jack', familyName: "O'Neill"})
                .then(function (user) {
                  return expect(user.slug).to.equal('oneill');
                });
        });
    });

    after(function () {
        return sequelize.close();
    });
});
