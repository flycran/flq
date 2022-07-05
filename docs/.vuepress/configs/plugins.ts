const { searchPlugin } = require('@vuepress/plugin-search')
const { externalLinkIconPlugin } = require('@vuepress/plugin-external-link-icon')

export const plugins = [
  searchPlugin({
    locales: {
      '/': {
        placeholder: '搜索',
      },
      '/en': {
        placeholder: '搜索',
      },
    },
  }),
  externalLinkIconPlugin({
    locales: {
      '/': {
        openInNewWindow: '在新窗口打开',
      },
      '/en': {
        openInNewWindow: 'Open in new window',
      }
    },
  }),
]
