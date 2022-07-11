import { DefaultThemeOptions } from '@vuepress/theme-default'

export const en: DefaultThemeOptions = {
  repoLabel: 'View source code',
  editLinkText: 'Help us improve this page!',
  lastUpdatedText: 'This page was updated on',
  selectLanguageName: 'English',
  selectLanguageText: 'Select language',
  selectLanguageAriaLabel: 'Select language',
  tip: 'tip',
  warning: 'warning',
  danger: 'danger',
  notFound: ['This page was captured by aliens'],
  backToHome: 'Return to home',
  navbar: [
    { text: 'guide', link: '/en/guide/' },
    { text: 'API', link: '/en/api/' },
    {
      text: 'Presentation form',
      children: ['/table/student.md', '/table/class.md'],
    },
    { text: 'update log', link: '/en/update/' },
    { text: 'support', link: '/en/support/' },
  ],
  sidebar: {
    '/guide/': [
      'readme.md',
      'introduction.md',
      'query.md',
      'condition.md',
      'model.md',
    ],
    '/api/': ['readme.md', 'model.md'],
    '/table/': ['student.md', 'class.md'],
  },
}
