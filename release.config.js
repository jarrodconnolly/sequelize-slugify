module.exports = {
  'release': {
    'branches': ["master", "next"]
  },
  'plugins': [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/npm',
    '@semantic-release/git',
    '@semantic-release/github'
  ],
  'preset': 'conventionalcommits'
};
