'use strict';

const SequelizeSlugify = require('../index');

let User;
let userData;

describe('slug generation', () => {
  beforeEach(async () => {
    User = await global.generateModel();
    userData = global.createUser();
  });

  it('should overwrite slug by default', async () => {
    SequelizeSlugify.slugifyModel(User, {source: ['givenName']});
    const user = await User.create(userData);
    const expectedValue1 = `${userData.givenName.toLowerCase()}`;
    expect(user.slug).toBe(expectedValue1);

    const newGivenName = global.generateGivenName();
    const newFamilyName = global.generateFamilyName();
    user.givenName = newGivenName;
    user.familyName = newFamilyName;
    const updatedUser = await user.save();
    const expectedValue2 = `${newGivenName.toLowerCase()}`;
    expect(updatedUser.slug).toBe(expectedValue2);
  });

  it('should not overwrite if source does not change', async () => {
    SequelizeSlugify.slugifyModel(User, {source: ['givenName']});
    const user = await User.create(userData);
    const expectedValue = `${userData.givenName.toLowerCase()}`;
    expect(user.slug).toBe(expectedValue);

    user.familyName = global.generateFamilyName();
    const updatedUser = await user.save();
    expect(updatedUser.slug).toBe(expectedValue);
  });

  it('should not overwrite slug if overwrite false', async () => {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName'],
      overwrite: false,
    });
    const user = await User.create(userData);
    const expectedValue = `${userData.givenName.toLowerCase()}`;
    expect(user.slug).toBe(expectedValue);

    const newGivenName = global.generateGivenName();
    const newFamilyName = global.generateFamilyName();
    user.givenName = newGivenName;
    user.familyName = newFamilyName;
    const updatedUser = await user.save();
    expect(updatedUser.slug).toBe(expectedValue);
  });

  it('regenerateSlug should overwrite slug when changed', async () => {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName'],
      overwrite: false,
    });
    const user = await User.create(userData);
    const newGivenName = global.generateGivenName();
    user.givenName = newGivenName;
    await user.regenerateSlug();
    const updatedUser = await user.save();
    const expectedValue = `${newGivenName.toLowerCase()}`;
    return expect(updatedUser.slug).toBe(expectedValue);
  });

  it('regenerateSlug should overwrite slug when never had one', async () => {
    // model saved prior to being slugified
    const user = await User.create(userData);
    // for user.slug - pg returns null while mysql & sqlite return undefined
    expect([null, undefined]).toContain(user.slug); // checks neither null nor undefined

    // later slugified
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName'],
      overwrite: false,
    });

    await user.regenerateSlug();
    const updatedUser = await user.save();
    const expectedValue = `${userData.givenName.toLowerCase()}`;
    return expect(updatedUser.slug).toBe(expectedValue);
  });
});
