"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugins = void 0;
var searchPlugin = require('@vuepress/plugin-search').searchPlugin;
var externalLinkIconPlugin = require('@vuepress/plugin-external-link-icon').externalLinkIconPlugin;
exports.plugins = [
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
];
