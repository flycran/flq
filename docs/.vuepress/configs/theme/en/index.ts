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
    { text: 'guide', link: '/en/guide/introduce' },
    { text: 'API', link: '/en/api/flq' },
    { text: 'Presentation form', link: '/en/table/student' },
    { text: 'support', link: '/en/support' },
  ],
  sidebar: {
    '/en/guide/': ['introduce', 'introduction', 'query'],
    '/en/api/': ['flq', 'model'],
    '/en/table/': ['student'],
  },
}