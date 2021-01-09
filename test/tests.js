/**
 * Copyright © 2014 sequelize-slugify
 * All Rights Reserved.
 */

'use strict';

const Sequelize = require('sequelize');
const SequelizeSlugify = require('../index');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

let sequelize;

const modelOptions = {};

const currentTestMode = process.env.TEST_MODE;
if (currentTestMode === 'pg') {
  const dbUsername = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PW || '';
  const host = process.env.DB_HOST || 'localhost';
  sequelize = new Sequelize('sequelize_slugify_test', dbUsername, dbPassword, {
    host: host,
    dialect: 'postgres',
    logging: false,
  });
} else if (currentTestMode === 'mysql') {
  const dbUsername = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PW || 'rootroot';
  sequelize = new Sequelize('sequelize_slugify_test', dbUsername, dbPassword, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
  });
  modelOptions.charset = 'utf8';
  // before(() => {
  //   return sequelize.query("DROP DATABASE IF EXISTS sequelize_slugify_test;")
  //     .then(() => {
  //       return sequelize.query("CREATE DATABASE sequelize_slugify_test;");
  //     });
  // });
} else if (currentTestMode === 'mariadb') {
  const dbUsername = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PW || 'rootroot';
  sequelize = new Sequelize('sequelize_slugify_test', dbUsername, dbPassword, {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false,
  });
  modelOptions.charset = 'utf8';
} else if (currentTestMode === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: false,
  });
} else {
  throw new Error('Invalid TEST_MODE');
}

var GetUser = function (modelname) {
  return sequelize.define(modelname, {
    slug: {
      type: Sequelize.STRING,
      unique: true,
    },
    alternateSlug: {
      type: Sequelize.STRING,
      unique: true,
    },
    givenName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    familyName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nickName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
  }, modelOptions);
};

var User = {};
var userId = 0;

describe('sequelize-slugify', function () {

    // user a new model for each test
    beforeEach(function () {
      User = GetUser('user' + userId);
      userId++;
      return sequelize.sync({force: true});
    });

    it('should create a slug from a single field', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName'],
      });

      return User.create({
        givenName: 'Suzan',
        familyName: 'Scheiber',
      }).then(function (user) {
        return expect(user.slug).to.equal('suzan');
      });
    });

    it('should create a slug from multiple fields', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName'],
      });

      return User.create({
        givenName: 'Ernesto',
        familyName: 'Elsass',
      }).then(function (user) {
        return expect(user.slug).to.equal('ernesto-elsass');
      });
    });

    xit('should bulk update a slug from the Model', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName'],
      });

      return User.create({
        givenName: 'Woibrert',
        familyName: 'Hamazoni',
      }).then(function () {
        return User.update({
          givenName: 'Hazzah',
        }, {where: {givenName: 'Woibrert'}});
      }).then(function () {
        return User.findOne({givenName: 'Hazzah'});
      }).then(function (user) {
        return expect(user.slug).to.equal('hazzah');
      });
    });

    it('should create a slug during a bulk create', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName'],
      });

      return User.bulkCreate([
        {givenName: 'Groyta', familyName: 'Helmerson'},
        {givenName: 'Weelan', familyName: 'Rolshier'},
      ]).then(function (user) {
        expect(user[0].slug).to.equal('groyta');
        expect(user[1].slug).to.equal('weelan');
      });
    });

    it('should use provided slug suffixes if the slug already exists', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName'],
        suffixSource: ['nickName'],
      });

      return User.create({
        givenName: 'Cleora',
        familyName: 'Curley',
      }).then(function () {
        return User.create({
          givenName: 'Cleora',
          familyName: 'Curley',
          nickName: 'Cleo',
        });
      }).then(function (user) {
        return expect(user.slug).to.equal('cleora-curley-cleo');
      });
    });

    it('should handle multiple slug suffix fields', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName'],
        suffixSource: ['nickName', 'age'],
      });

      return User.create({
        givenName: 'Donald',
        familyName: 'Draper',
      }).then(function () {
        return User.create({
          givenName: 'Donald',
          familyName: 'Draper',
          nickName: 'Don',
        });
      }).then(function () {
        return User.create({
          givenName: 'Donald',
          familyName: 'Draper',
          nickName: 'Don',
          age: 42,
        });
      }).then(function (user) {
        return expect(user.slug).to.equal('donald-draper-don-42');
      });
    });

    it('should fall back on numeric suffixes', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName'],
        suffixSource: ['nickName', 'age'],
      });

      return User.create({
        givenName: 'Gary',
        familyName: 'Gray',
        nickName: 'Gutsy',
      }).then(function () {
        return User.create({
          givenName: 'Gary',
          familyName: 'Gray',
          nickName: 'Gutsy',
        });
      }).then(function () {
        return User.create({
          givenName: 'Gary',
          familyName: 'Gray',
          nickName: 'Gutsy',
        });
      }).then(function () {
        return User.create({
          givenName: 'Gary',
          familyName: 'Gray',
          nickName: 'Gutsy',
        });
      }).then(function (user) {
        return expect(user.slug).to.equal('gary-gray-gutsy-2');
      });
    });

    it('should increment slug suffix if it already exists', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName'],
      });

      return User.create({
        givenName: 'Cleora',
        familyName: 'Curley',
      }).then(function () {
        return User.create({
          givenName: 'Cleora',
          familyName: 'Curley',
        });
      }).then(function (user) {
        return expect(user.slug).to.equal('cleora-curley-1');
      });
    });


    it('should create a slug using custom slug field', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName'],
        column: 'alternateSlug',
      });

      return User.create({
        givenName: 'Brobar',
        familyName: 'Handlemart',
      }).then(function (user) {
        return expect(user.alternateSlug).to.equal('brobar');
      });
    });

    it('should pass slug options to slug module', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName'],
        slugOptions: {
          replacement: '#',
          lower: false,
        },
      });

      return User.create({
        givenName: 'Here There',
        familyName: 'Justified',
      }).then(function (user) {
        return expect(user.slug).to.equal('Here#There');
      });
    });

    it('should replace the incremental separator if replacement slug option is specified', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName'],
        incrementalSeparator: '+',
      });

      return User.create({
        givenName: 'Cleora',
        familyName: 'Curley',
      }).then(function () {
        return User.create({
          givenName: 'Cleora',
          familyName: 'Curley',
        });
      }).then(function (user) {
        return expect(user.slug).to.equal('cleora-curley+1');
      });
    });

    it('should use the default incremental separator if no replacement slug option is specified', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName'],
        slugOptions: {
          lower: true,
        },
      });

      return User.create({
        givenName: 'Cleora',
        familyName: 'Curley',
      }).then(function () {
        return User.create({
          givenName: 'Cleora',
          familyName: 'Curley',
        });
      }).then(function (user) {
        return expect(user.slug).to.equal('cleora-curley-1');
      });
    });

    it('should return null if it fails to slugify the source', function () {
      SequelizeSlugify.slugifyModel(User, {
        source: ['givenName', 'familyName'],
        slugOptions: {
          lower: true,
        },
      });

      return User.create({
        givenName: '你好我的名字是',
        familyName: '你好我的名字是',
      }).then(function (user) {
        return expect(user.slug).to.equal(null);
      });
    });

    describe('overwrite & force regeneration', function () {
      it('should overwrite slug by default', function () {
        SequelizeSlugify.slugifyModel(User, {
          source: ['givenName'],
        });

        return User.create({
          givenName: 'Rupert',
          familyName: 'Rinaldi',
        }).then(function (user) {
          user.givenName = 'Genie';
          user.familyName = 'Gayden';

          return user.save();
        }).then(function (updatedUser) {
          return expect(updatedUser.slug).to.equal('genie');
        });
      });

      it('should NOT overwrite slug source does not change', function () {
        SequelizeSlugify.slugifyModel(User, {
          source: ['givenName'],
        });

        return User.create({
          givenName: 'Brewhan',
          familyName: 'Herrold',
        }).then(function (user) {
          user.givenName = 'Brewhan';
          user.familyName = 'Filmer';

          return user.save();
        }).then(function (updatedUser) {
          return expect(updatedUser.slug).to.equal('brewhan');
        });
      });

      it('should NOT overwrite slug if option says not to', function () {
        SequelizeSlugify.slugifyModel(User, {
          source: ['givenName'],
          overwrite: false,
        });

        return User.create({
          givenName: 'Miquel',
          familyName: 'Mceachin',
        }).then(function (user) {
          user.givenName = 'Sallie';
          user.familyName = 'Shira';

          return user.save();
        }).then(function (updatedUser) {
          return expect(updatedUser.slug).to.equal('miquel');
        });
      });

      it('regenerateSlug should overwrite slug when changed', async function () {
        SequelizeSlugify.slugifyModel(User, {
          source: ['givenName'],
          overwrite: false,
        });
        const user = await User.create({givenName: 'Zhane', familyName: 'Sandoval'});
        user.givenName = 'Salma';
        await user.regenerateSlug();
        const updatedUser = await user.save();
        return expect(updatedUser.slug).to.equal('salma');
      });

      it('regenerateSlug should overwrite slug when never had one', async function () {
        // model saved prior to being slugified
        const user = await User.create({givenName: 'Khia', familyName: 'Metcalfe'});
        // for user.slug - pg returns null while mysql & sqlite return undefined
        expect(user.slug).to.not.exist; // checks neither null nor undefined

        // later slugified
        SequelizeSlugify.slugifyModel(User, {
          source: ['givenName'],
          overwrite: false,
        });

        await user.regenerateSlug();
        const updatedUser = await user.save();
        return expect(updatedUser.slug).to.equal('khia');
      });
    });

    describe('transactions', function () {
      it('roll back in managed transactions on create', async function () {
        SequelizeSlugify.slugifyModel(User, {
          source: ['givenName', 'familyName'],
        });

        try {
          await sequelize.transaction(async (t) => {
            const user = await User.create({
              givenName: 'Lloyd',
              familyName: 'Gale',
            }, {transaction: t});
            // user created inside transaction
            // create completes, slug has been updated
            expect(user.slug).to.equal('lloyd-gale');
            // error inside transaction, auto rollback is performed
            throw new Error();
          });
        } catch (error) {
          // entire create rolls back, user no longer exists
          const user = await User.findOne({where:{givenName:'Lloyd'}});
          expect(user).to.equal(null);
        }
      });

      it('roll back in managed transactions on update', async function () {
        SequelizeSlugify.slugifyModel(User, {
          source: ['givenName', 'familyName'],
        });

        const user = await User.create({
          givenName: 'Jenny',
          familyName: 'Lozano',
        });
        // user created initially outside transaction
        expect(user.slug).to.equal('jenny-lozano');

        try {
          await sequelize.transaction(async (t) => {
            user.familyName = 'Gaia';
            await user.save({transaction: t});
            // update completes, slug has been updated
            const updatedUser = await User.findOne({
              where:{givenName:'Jenny',
                transaction: t
              }});
            expect(updatedUser.slug).to.equal('jenny-gaia');
            // error inside transaction, auto rollback is performed
            throw new Error();
          });
        } catch (error) {
          // the user is now back to the original slug
          const user = await User.findOne({where:{givenName:'Jenny'}});
          return expect(user.slug).to.equal('jenny-lozano');
        }
      });

      it('roll back managed transactions on update - passTransaction:false', async function () {
        SequelizeSlugify.slugifyModel(User, {
          source: ['givenName', 'familyName'],
          passTransaction: false
        });

        const user = await User.create({
          givenName: 'Jude',
          familyName: 'Cope',
        });
        // user created initially outside transaction
        expect(user.slug).to.equal('jude-cope');

        try {
          await sequelize.transaction(async (t) => {
            user.familyName = 'Nimrah';
            await user.save({transaction: t});
            // update completes, slug has been updated
            const updatedUser = await User.findOne({
              where:{givenName:'Jude'},
              transaction: t
            });
            expect(updatedUser.slug).to.equal('jude-nimrah');
            // error inside transaction, auto rollback is performed
            throw new Error();
          });
        } catch (error) {
          // the user is now back to the original slug
          const user = await User.findOne({where:{givenName:'Jude'}});
          expect(user.slug).to.equal('jude-cope');
        }
      });

    });

    after(function () {
      return sequelize.close();
    });
  });
