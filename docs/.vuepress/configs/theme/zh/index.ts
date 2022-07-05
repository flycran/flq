import { DefaultThemeOptions } from '@vuepress/theme-default'
export const zh: DefaultThemeOptions = {
  repoLabel: '查看源码',
  editLinkText: '帮助我们改善此页面！',
  lastUpdatedText: '本页更新于',
  selectLanguageName: '简体中文',
  selectLanguageText: '选择语言',
  selectLanguageAriaLabel: '选择语言',
  tip: '提示',
  warning: '警告',
  danger: '危险',
  notFound: ['此页面被外星人抓走了'],
  backToHome: '返回首页',
  navbar: [
    { text: '指南', link: '/guide/introduce' },
    { text: 'API', link: '/api/flq' },
    { text: '演示表格', link: '/table/student' },
    { text: '支持', link: '/support' },
  ],
  sidebar: {
    '/guide/': ['introduce', 'introduction', 'query'],
    '/api/': ['flq', 'model'],
    '/table/': ['student'],
  },
}
