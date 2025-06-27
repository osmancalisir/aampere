import depcheck from 'depcheck';

const options = {
  ignoreDirs: ['dist', 'build'],

  ignoreMatches: [
    '@types/*',
    '@testing-library/*',
    'dotenv',
    'path',
    "jest-environment-jsdom",
    'tsx'
  ],

  specials: [
    depcheck.special.eslint,
    depcheck.special.babel,
    depcheck.special.webpack,
    depcheck.special.jest,
    depcheck.special.typescript,
  ],
};

depcheck(process.cwd(), options)
  .then((unused) => {
    console.log('Unused dependencies:', unused.dependencies);
    console.log('Unused devDependencies:', unused.devDependencies);
    console.log('Missing dependencies:', unused.missing);
  })
  .catch((error) => {
    console.error('Error running depcheck:', error);
  });
