'use strict';

const SequelizeSlugify = require('../index');

let User;
let userData;

describe('slug suffix', () => {
  beforeEach(async () => {
    User = await global.generateModel();
    userData = global.createUser();
  });

  it('should use slug suffixSource', async () => {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
      suffixSource: ['nickName'],
    });
    const userFirst = await User.create(userData);
    const userSecond = await User.create(userData);
    const expectedFirstValue = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    const expectedSecondValue = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-${userData.nickName.toLowerCase()}`;
    expect(userFirst.slug).toBe(expectedFirstValue);
    expect(userSecond.slug).toBe(expectedSecondValue);
  });

  it('should use multiple suffixSource', async ()=> {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
      suffixSource: ['nickName', 'age'],
    });
    const userFirst = await User.create(userData);
    const userSecond = await User.create(userData);
    const userThird = await User.create(userData);
    const expectedFirstValue = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    const expectedSecondValue = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-${userData.nickName.toLowerCase()}`;
    const expectedThirdValue = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-${userData.nickName.toLowerCase()}-${userData.age}`;
    expect(userFirst.slug).toBe(expectedFirstValue);
    expect(userSecond.slug).toBe(expectedSecondValue);
    expect(userThird.slug).toBe(expectedThirdValue);
  });

  it('should fall back on numeric suffixes (all suffix exist)', async ()=> {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
      suffixSource: ['nickName', 'age'],
    });
    const user1 = await User.create(userData);
    const user2 = await User.create(userData);
    const user3 = await User.create(userData);
    const user4 = await User.create(userData);
    const expected1Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    const expected2Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-${userData.nickName.toLowerCase()}`;
    const expected3Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-${userData.nickName.toLowerCase()}-${userData.age}`;
    const expected4Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-${userData.nickName.toLowerCase()}-${userData.age}-1`;
    expect(user1.slug).toBe(expected1Value);
    expect(user2.slug).toBe(expected2Value);
    expect(user3.slug).toBe(expected3Value);
    expect(user4.slug).toBe(expected4Value);
  });

  it('should fall back on numeric suffixes (one suffix missing)', async ()=> {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
      suffixSource: ['nickName', 'age'],
    });
    delete userData.age;
    const user1 = await User.create(userData);
    const user2 = await User.create(userData);
    const user3 = await User.create(userData);
    const user4 = await User.create(userData);
    const expected1Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    const expected2Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-${userData.nickName.toLowerCase()}`;
    const expected3Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-${userData.nickName.toLowerCase()}-1`;
    const expected4Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-${userData.nickName.toLowerCase()}-2`;
    expect(user1.slug).toBe(expected1Value);
    expect(user2.slug).toBe(expected2Value);
    expect(user3.slug).toBe(expected3Value);
    expect(user4.slug).toBe(expected4Value);
  });

  it('should fall back on numeric suffixes (all suffix missing)', async ()=> {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
      suffixSource: ['nickName', 'age'],
    });
    delete userData.age;
    delete userData.nickName;
    const user1 = await User.create(userData);
    const user2 = await User.create(userData);
    const user3 = await User.create(userData);
    const expected1Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    const expected2Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-1`;
    const expected3Value = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}-2`;
    expect(user1.slug).toBe(expected1Value);
    expect(user2.slug).toBe(expected2Value);
    expect(user3.slug).toBe(expected3Value);
  });

});
