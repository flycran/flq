"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cli_1 = require("@vuepress/cli");
var theme_default_1 = require("@vuepress/theme-default");
var configs_1 = require("./configs");
exports.default = (0, cli_1.defineUserConfig)({
    base: '/flq/',
    locales: {
        '/': {
            title: 'FLQ 中文文档',
            description: '让缺乏sql经验的前端开发者与数据库轻松交互',
        },
        '/en/': {
            title: 'FLQ English documents',
            description: 'Make it easy for front-end developers who lack SQL experience to interact with the database',
        },
    },
    theme: (0, theme_default_1.defaultTheme)({
        logo: '/hero.png',
        repo: 'https://gitee.com/cffh/flq',
        lastUpdated: true,
        contributors: false,
        sidebarDepth: 2,
        locales: {
            '/': configs_1.theme.zh,
            '/en/': configs_1.theme.en,
        },
    }),
});
