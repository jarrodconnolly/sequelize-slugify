'use strict';

let User;
let userData;

describe('slug generation', () => {
  beforeEach(async () => {
    User = await global.generateModel();
    userData = global.createUser();
  });

  it('should create a slug from a single field', async () => {
    global.slugifyModel(User, {source: ['givenName']});
    const user = await User.create(userData);
    const expectedValue = `${userData.givenName.toLowerCase()}`;
    expect(user.slug).toBe(expectedValue);
  });
});
