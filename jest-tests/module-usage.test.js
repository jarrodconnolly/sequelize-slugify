'use strict';

describe('module usage', () => {
  it('should allow direct require', async () => {
    const SequelizeSlugify = require('../index');
    expect(SequelizeSlugify).toBeDefined();
  });
  it('should allow destructured require', async () => {
    const {SequelizeSlugify} = require('../index');
    expect(SequelizeSlugify).toBeDefined();
  });
});
