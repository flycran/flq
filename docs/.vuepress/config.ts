import { defineUserConfig } from '@vuepress/cli'
import { defaultTheme } from '@vuepress/theme-default'

import { theme } from './configs'

export default defineUserConfig({
  base: '/flq/',
  locales: {
    '/': {
      title: 'FLQ 中文文档',
      description: '让缺乏sql经验的前端开发者与数据库轻松交互',
    },
    '/en/': {
      title: 'FLQ English documents',
      description:
        'Make it easy for front-end developers who lack SQL experience to interact with the database',
    },
  },
  theme: defaultTheme({
    logo: '/hero.png',
    repo: 'https://gitee.com/cffh/flq',
    lastUpdated: true,
    contributors: false,
    sidebarDepth: 2,
    locales: {
      '/': theme.zh,
      '/en/': theme.en,
    },
  }),
})
