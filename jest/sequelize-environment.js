'use strict';

const NodeEnvironment = require('jest-environment-node');
const Sequelize = require('sequelize');
const { faker } = require('@faker-js/faker');
const dotenv = require('dotenv');

class SequelizeEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.dialect = process.env.DIALECT;
    dotenv.config();
  }

  async setup() {
    await super.setup();

    const { env } = process;

    this.modelOptions = {};
    this.modelCounter = 0;

    if (!this.dialect || this.dialect === 'sqlite') {
      this.sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
      });
    } else if (this.dialect === 'postgres') {
      this.sequelize = new Sequelize({
        dialect: 'postgres',
        database: env.SEQ_SLUG_DB || 'sequelize_slugify_test',
        username: env.SEQ_SLUG_PG_USER || 'postgres',
        password: env.SEQ_SLUG_PG_PW || 'postgres',
        host: env.SEQ_SLUG_PG_HOST || '127.0.0.1',
        port: env.SEQ_SLUG_PG_PORT || 5432,
        logging: false,
      });
    } else if (this.dialect === 'mysql') {
      this.sequelize = new Sequelize({
        dialect: 'mysql',
        database: env.SEQ_SLUG_DB || 'sequelize_slugify_test',
        username: env.SEQ_SLUG_MYSQL_USER || 'mysql',
        password: env.SEQ_SLUG_MYSQL_PW || 'mysql',
        host: env.SEQ_SLUG_MYSQL_HOST || '127.0.0.1',
        port: env.SEQ_SLUG_MYSQL_PORT || 3306,
        logging: false,
      });
      this.modelOptions.charset = 'utf8';
    } else if (this.dialect === 'mariadb') {
      this.sequelize = new Sequelize({
        dialect: 'mariadb',
        database: env.SEQ_SLUG_DB || 'sequelize_slugify_test',
        username: env.SEQ_SLUG_MARIADB_USER || 'mariadb',
        password: env.SEQ_SLUG_MARIADB_PW || 'mariadb',
        host: env.SEQ_SLUG_MARIADB_HOST || '127.0.0.1',
        port: env.SEQ_SLUG_MARIADB_PORT || 3306,
        logging: false,
      });
      this.modelOptions.charset = 'utf8';
    } else if (this.dialect === 'mssql') {
      this.sequelize = new Sequelize({
        dialect: 'mssql',
        database: env.SEQ_SLUG_DB || 'sequelize_slugify_test',
        username: env.SEQ_SLUG_MSSQL_USER || 'sa',
        password: env.SEQ_SLUG_MSSQL_PW || 'mssql',
        host: env.SEQ_SLUG_MSSQL_HOST || 'localhost',
        port: env.SEQ_SLUG_MSSQL_PORT || 1433,
        logging: false,
      });
    } else {
      throw new Error(`Invalid DIALECT:${this.dialect} for testing`);
    }

    faker.seed(42);
    this.global.sequelize = this.sequelize;
    this.global.DataTypes = Sequelize.DataTypes;
    this.global.generateModel = this.generateModel.bind(this);
    this.global.createUser = this.createUser;
    this.global.generateGivenName = () => {
      return faker.name.firstName();
    };
    this.global.generateFamilyName = ()=> {
      return faker.name.lastName();
    };
    this.global.generateRandomWord = () => {
      return faker.word.noun();
    };
  }

  async teardown() {
    if(this.global.sequelize) {
      await this.global.sequelize.close();
    }
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }

  async generateModel(options = {}) {
    this.modelCounter++;

    const mergedOptions = Object.assign({}, this.modelOptions, options);
    const uniqueTableId = `TestUser-${process.pid}-${this.modelCounter}`;
    const User = this.sequelize.define(uniqueTableId, {
      slug: {
        type: Sequelize.STRING,
        unique: true,
      },
      alternateSlug: {
        type: Sequelize.STRING,
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
    }, mergedOptions);

    await this.sequelize.sync({force: true});
    return User;
  }

  createUser() {
    return {
      givenName: faker.name.firstName(),
      familyName: faker.name.lastName(),
      nickName: faker.lorem.word(),
      age: faker.datatype.number()
    };
  }
}

module.exports = SequelizeEnvironment;
