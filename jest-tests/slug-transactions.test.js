'use strict';

const SequelizeSlugify = require('../index');

let User;
let userData;

describe('slug options', () => {
  beforeEach(async () => {
    User = await global.generateModel();
    userData = global.createUser();
  });

  it('roll back in managed transactions on create', async () => {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
    });

    try {
      await global.sequelize.transaction(async (t) => {
        const user = await User.create(userData, {transaction: t});
        // user created inside transaction
        // create completes, slug has been updated
        const expectedValue = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
        expect(user.slug).toBe(expectedValue);
        // fake an error inside transaction, auto rollback is performed
        throw new Error('Fake Error');
      });
    } catch (error) {
      // ensure the error was our expected one
      expect(error.message).toBe('Fake Error');
      // entire create rolls back, user no longer exists
      const user = await User.findOne({where:{givenName:`${userData.givenName}`}});
      expect(user).toBe(null);
    }
  });


  it('roll back in managed transactions on update', async () => {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
    });

    // user created initially outside transaction
    const user = await User.create(userData);
    const expectedValue1 = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    expect(user.slug).toBe(expectedValue1);

    try {
      await global.sequelize.transaction(async (t) => {
        const newFamilyName = global.generateFamilyName();
        user.familyName = newFamilyName;
        await user.save({transaction: t});
        // update completes, slug has been updated
        const updatedUser = await User.findOne({where:{givenName:`${userData.givenName}`}, transaction: t});
        const expectedValue2 = `${userData.givenName.toLowerCase()}-${newFamilyName.toLowerCase()}`;
        expect(updatedUser.slug).toBe(expectedValue2);
        // error inside transaction, auto rollback is performed
        throw new Error('Fake Error');
      });
    } catch (error) {
      // ensure the error was our expected one
      expect(error.message).toBe('Fake Error');
      // the user is now back to the original slug
      const user = await User.findOne({where:{givenName:`${userData.givenName}`}});
      return expect(user.slug).toBe(expectedValue1);
    }
  });

  it('roll back in managed transactions on update (passTransaction:false)', async () => {
    SequelizeSlugify.slugifyModel(User, {
      source: ['givenName', 'familyName'],
      passTransaction: false
    });

    // user created initially outside transaction
    const user = await User.create(userData);
    const expectedValue1 = `${userData.givenName.toLowerCase()}-${userData.familyName.toLowerCase()}`;
    expect(user.slug).toBe(expectedValue1);

    try {
      await global.sequelize.transaction(async (t) => {
        const newFamilyName = global.generateFamilyName();
        user.familyName = newFamilyName;
        await user.save({transaction: t});
        // update completes, slug has been updated
        const updatedUser = await User.findOne({where:{givenName:`${userData.givenName}`}, transaction: t});
        const expectedValue2 = `${userData.givenName.toLowerCase()}-${newFamilyName.toLowerCase()}`;
        expect(updatedUser.slug).toBe(expectedValue2);
        // error inside transaction, auto rollback is performed
        throw new Error('Fake Error');
      });
    } catch (error) {
      // ensure the error was our expected one
      expect(error.message).toBe('Fake Error');
      // the user is now back to the original slug
      const user = await User.findOne({where:{givenName:`${userData.givenName}`}});
      return expect(user.slug).toBe(expectedValue1);
    }
  });

});
