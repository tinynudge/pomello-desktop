require('dotenv').config();

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: process.env.VITE_APP_ID,
  productName: 'Pomello',
  directories: {
    output: 'dist',
    buildResources: 'build',
  },
  files: ['packages/**/dist/**', 'build/icons/**'],
  extraResources: ['packages/**/translations/**', 'sounds/**', 'translations/**'],
  linux: {
    executableName: 'pomello',
    category: 'Utility',
    synopsis: 'The Pomodoro App for Doers',
    icon: 'icons',
  },
  mac: {
    entitlements: './build/entitlements.mac.plist',
    hardenedRuntime: true,
    target: {
      arch: 'universal',
      target: 'dmg',
    },
  },
  generateUpdatesFilesForAllChannels: true,
  publish: {
    provider: 's3',
    bucket: process.env.S3_RELEASE_BUCKET,
    acl: 'private',
  },
};

module.exports = config;
