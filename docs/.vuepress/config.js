const { searchPlugin } = require('@vuepress/plugin-search')
const { externalLinkIconPlugin } = require('@vuepress/plugin-external-link-icon')
module.exports = {
  title: 'FLQ 中文文档',
  description: '让缺乏sql经验的前端开发者与数据库轻松交互',
  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: '搜索',
        },
      },
    }),
    externalLinkIconPlugin({
      locales: {
        '/': {
          openInNewWindow: '在新窗口打开',
        },
      },
    }),
  ],
  themeConfig: {
    logo: '/hero.png',
    repo: 'https://gitee.com/cffh/flq',
    repoLabel: '查看源码',
    editLinks: true,
    editLinkText: '帮助我们改善此页面！',
    nav: [
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '演示表格', link: '/table/' },
      { text: '支持', link: '/support/' },
    ],
    sidebar: {
      '/guide/': ['', 'introduction', 'query'],
      '/api/': [''],
      '/table/': ['', 'student'],
      '/support/': [''],
    },
  },
}
