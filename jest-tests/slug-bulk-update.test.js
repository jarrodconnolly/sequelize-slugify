'use strict';

const SequelizeSlugify = require('../index');

let User;

describe('bulk update', () => {
  beforeEach(async () => {
    User = await global.generateModel();
  });

  it('should create a slug during a bulk create', async () => {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName'],
    });

    const user1 = global.createUser();
    const user2 = global.createUser();

    const results = await User.bulkCreate([user1, user2]);
    expect(results[0].slug).toBe(`${user1.givenName.toLowerCase()}`);
    expect(results[1].slug).toBe(`${user2.givenName.toLowerCase()}`);
  });

  it('should bulk update a slug from the Model', async ()=> {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName'],
      bulkUpdate: true
    });

    const userData = global.createUser();
    await User.create(userData);
    const newGivenName = global.generateGivenName();

    await User.update({givenName: newGivenName}, {where: {givenName: userData.givenName}});

    const foundUser = await User.findOne({where:{givenName:newGivenName}});
    expect(foundUser.slug).toBe(newGivenName.toLowerCase());
  });

  it('should bulk update with manual individualHooks', async ()=> {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName'],
    });

    const userData = global.createUser();
    await User.create(userData);
    const newGivenName = global.generateGivenName();

    await User.update({givenName: newGivenName}, {
      where: {givenName: userData.givenName},
      individualHooks: true
    });

    const foundUser = await User.findOne({where:{givenName:newGivenName}});
    expect(foundUser.slug).toBe(newGivenName.toLowerCase());
  });
});
