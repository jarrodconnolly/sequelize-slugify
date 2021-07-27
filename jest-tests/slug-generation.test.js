'use strict';

const SequelizeSlugify = require('../index');

let User;
let userData;

describe('slug generation', () => {
  beforeEach(async () => {
    User = await global.generateModel();
    userData = global.createUser();
  });

  it('should create a slug from a single field', async () => {
    SequelizeSlugify.slugifyModel(User, {source: ['givenName']});
    const user = await User.create(userData);
    const expectedValue = `${userData.givenName.toLowerCase()}`;
    expect(user.slug).toBe(expectedValue);
  });

  it('should create a slug from multiple fields', async () => {
    SequelizeSlugify.slugifyModel(User, {source: ['givenName', 'familyName']});
    const user = await User.create(userData);
    const expectedValue = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    expect(user.slug).toBe(expectedValue);
  });

  it('should increment suffix if slug already exists', async () => {
    SequelizeSlugify.slugifyModel(User, {source: ['givenName', 'familyName']});
    const user1 = await User.create(userData);
    const user2 = await User.create(userData);
    const expectedValue1 = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    expect(user1.slug).toBe(expectedValue1);
    const expectedValue2 = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-1`;
    expect(user2.slug).toBe(expectedValue2);
  });

  it('should return null if it fails to slugify the source', async () => {
    SequelizeSlugify.slugifyModel(User, {source: ['givenName', 'familyName']});
    userData.givenName = '你好我的名字是';
    userData.familyName = '你好我的名字是';
    const user = await User.create(userData);
    expect(user.slug).toBe(null);
  });

  it('should create a slug from a VIRTUAL field', async () => {
    const uniqueTableId = `TestUser-${process.pid}-VIRTUAL`;
    const User = global.sequelize.define(uniqueTableId, {
      slug: {
        type: global.DataTypes.STRING,
        unique: true,
      },
      givenName: {
        type: global.DataTypes.STRING,
        allowNull: false,
      },
      _givenName: {
        type: global.DataTypes.VIRTUAL,
        get() {
          return `VIRTUAL-${this.get('givenName')}`;
        }
      }
    });
    await global.sequelize.sync({force: true});
    SequelizeSlugify.slugifyModel(User, {source: ['_givenName']});
    const user = await User.create(userData);

    // Unable to detect if VIRTUAL field has changed
    // regenerateSlug manually :(
    await user.regenerateSlug();

    const expectedValue = `virtual-${userData.givenName.toLowerCase()}`;
    expect(user.slug).toBe(expectedValue);
  });
});
