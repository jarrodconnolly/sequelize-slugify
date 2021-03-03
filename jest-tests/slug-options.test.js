'use strict';

const SequelizeSlugify = require('../index');

let User;
let userData;

describe('slug options', () => {
  beforeEach(async () => {
    User = await global.generateModel();
    userData = global.createUser();
  });

  it('should create a slug using custom slug field', async () =>{
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName'],
      column: 'alternateSlug',
    });
    const user = await User.create(userData);
    const expectedValue = `${userData.givenName.toLowerCase()}`;
    expect(user.alternateSlug).toBe(expectedValue);
  });

  it('should pass options (incrementalSeparator)', async () =>{
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
      incrementalSeparator: '+',
    });
    const user1 = await User.create(userData);
    const user2 = await User.create(userData);
    const expectedValue1 = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    expect(user1.slug).toBe(expectedValue1);
    const expectedValue2 = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}+1`;
    expect(user2.slug).toBe(expectedValue2);
  });

  it('should pass slugOptions (overrides defaults)', async () =>{
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
      slugOptions: {}
    });
    const user1 = await User.create(userData);
    const user2 = await User.create(userData);
    const expectedValue1 = `${userData.givenName}-${userData.familyName}`;
    expect(user1.slug).toBe(expectedValue1);
    const expectedValue2 = `${userData.givenName}-${userData.familyName}-1`;
    expect(user2.slug).toBe(expectedValue2);
  });

  it('should pass slugOptions (replacement, lower)', async () =>{
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
      slugOptions: {
        replacement: '#',
        lower: false,
      },
    });
    const user = await User.create(userData);
    const expectedValue = `${userData.givenName}#${userData.familyName}`;
    expect(user.slug).toBe(expectedValue);
  });

  it('should check soft deleted records in paranoid table, if specified', async () => {
    const ParanoidUser = await global.generateModel({ paranoid: true });

    SequelizeSlugify.slugifyModel(ParanoidUser, {
      source: ['givenName'],
      paranoid: false
    });

    const userToDelete = await ParanoidUser.create(userData);
    await userToDelete.destroy();
    const identicalUser = await ParanoidUser.create(userData);
    const expectedValue = `${userData.givenName.toLowerCase()}-1`;
    return expect(identicalUser.slug).toBe(expectedValue);
  });

});
