'use strict';

const SequelizeSlugify = require('../index');

let User;
// let userData;

describe('bulk update', () => {
  beforeEach(async () => {
    User = await global.generateModel();
    // userData = global.createUser();
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
});

// xit('should bulk update a slug from the Model', function () {
//   SequelizeSlugify.slugifyModel(User, {
//     source: ['givenName'],
//   });
//
//   return User.create({
//     givenName: 'Woibrert',
//     familyName: 'Hamazoni',
//   }).then(function () {
//     return User.update({
//       givenName: 'Hazzah',
//     }, {where: {givenName: 'Woibrert'}});
//   }).then(function () {
//     return User.findOne({givenName: 'Hazzah'});
//   }).then(function (user) {
//     return expect(user.slug).to.equal('hazzah');
//   });
// });
//

// });
