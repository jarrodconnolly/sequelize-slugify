'use strict';

const NodeEnvironment = require('jest-environment-node');
const Sequelize = require('sequelize');
const SequelizeSlugify = require('../index');
const faker = require('faker');

class SequelizeEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.dialect = process.env.DIALECT;
  }

  async setup() {
    await super.setup();

    this.modelOptions = {};
    this.modelCounter = 0;

    if (this.dialect === 'sqlite') {
      this.sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
      });
    } else {
      throw new Error('Invalid DIALECT for testing');
    }

    faker.seed(42);
    this.global.sequelize = this.sequelize;
    this.global.generateModel = this.generateModel;
    this.global.createUser = this.createUser;
    this.global.slugifyModel = SequelizeSlugify.slugifyModel;
  }

  async teardown() {
    this.global.Sequelize = null;
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }

  async generateModel(options = {}) {
    this.modelCounter++;

    const User = this.sequelize.define(`TestUser${this.modelCounter}`, {
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
    }, Object.assign({}, this.modelOptions, options));

    await this.sequelize.sync({force: true});
    return User;
  }

  createUser() {
    return {
      givenName: faker.name.firstName(),
      familyName: faker.name.lastName(),
      nickName: faker.lorem.word(),
      age: faker.random.number()
    };
  }
}

module.exports = SequelizeEnvironment;
