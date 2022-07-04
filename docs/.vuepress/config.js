module.exports = {
  title: 'FLQ 中文文档',
  description: '让缺乏sql经验的前端开发者与数据库轻松交互',
  themeConfig: {
    logo: '/hero.png',
    repo: 'https://gitee.com/cffh/flq',
    docsRepo: 'https://gitee.com/cffh/flq-document',
    repoLabel: '查看源码',
    editLinks: true,
    editLinkText: '帮助我们改善此页面！',
    nav: [
      { text: '指南', link: '/guide' },
      { text: 'API', link: '/api' },
      { text: '支持', link: '/support' },
    ],
    sidebar: {
      '/guide/': ['', 'introduction'],
    },
  },
}
