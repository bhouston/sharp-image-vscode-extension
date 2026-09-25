import { publish as publishExtension, setVersion as setExtensionVersion } from './scripts/release-vscode-extension.mjs';

export default {
  branches: ['main'],
  repositoryUrl: 'https://github.com/bhouston/sharp-image-vscode-extension.git',
  tagFormat: 'v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', { preset: 'conventionalcommits' }],
    ['@semantic-release/release-notes-generator', { preset: 'conventionalcommits' }],
    {
      prepare: (_pluginConfig, { nextRelease }) => {
        // Not npm-published; pin package.json to the shared version stream so
        // the VS Code Marketplace and Open VSX listings match the git tag.
        setExtensionVersion(nextRelease.version);
      },
      publish: () => {
        publishExtension();
      },
    },
    [
      '@semantic-release/github',
      {
        assets: ['*.vsix'],
        successComment: false,
        failComment: false,
        releasedLabels: false,
      },
    ],
  ],
};
