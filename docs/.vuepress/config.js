import { defineUserConfig } from 'vuepress'
import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'
import { searchPlugin } from '@vuepress/plugin-search'
import { pwaPlugin } from '@vuepress/plugin-pwa'
import { pwaPopupPlugin } from '@vuepress/plugin-pwa-popup'

export default defineUserConfig({
  base: '/nucleusx-core-docs/',
  bundler: viteBundler(),
  title: 'NucleusX-Core 文档',
  description: 'NucleusX 运行时核心库文档',

  plugins: [
    searchPlugin({
      locales: {
        '/': {
          placeholder: '搜索',
        }
      }
    }),
    pwaPlugin({
      favicon: '/favicon.ico',
      cacheHTML: true,
      cachePic: true,
      appendBase: true,
      themeColor: '#3eaf7c',
      apple: {
        icon: '/assets/img/apple-icon-152.png',
        statusBarColor: 'black'
      },
      msTile: {
        image: '/assets/img/ms-icon-144.png',
        color: '#ffffff'
      },
      popupComponent: 'PwaPopup',
      locales: {
        '/': {
          install: 'Install',
          hint: 'Available offline',
          update: 'New content is available.',
          updateHint: 'Hit the refresh button to update promptly.'
        }
      }
    }),
    pwaPopupPlugin()
  ],

  theme: defaultTheme({
    logo: null,
    repo: 'https://github.com/nucleusx/core',
    docsDir: 'docs',
    
    navbar: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' },
      { text: '示例', link: '/examples/' },
      { text: 'GitHub', link: 'https://github.com/nucleusx/core' }
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          children: [
            '/guide/README.md',
            '/guide/getting-started.md',
            '/guide/installation.md',
            '/guide/configuration.md'
          ]
        },
        {
          text: '功能详解',
          children: [
            '/guide/features/README.md',
            '/guide/features/concepts.md',
            '/guide/features/architecture.md',
            '/guide/features/runtime.md',
            '/guide/features/routing.md',
            '/guide/features/state-management.md',
            '/guide/features/requests.md',
            '/guide/features/logging.md',
            '/guide/features/best-practices.md',
            '/guide/features/faq.md'
          ]
        },
        {
          text: '法律与授权',
          children: [
            '/guide/license.md'
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          children: [
            '/api/README.md',
            '/api/core.md',
            '/api/router.md',
            '/api/store.md',
            '/api/request.md',
            '/api/logger.md'
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例代码',
          children: [
            '/examples/README.md',
            '/examples/basic.md',
            '/examples/routing.md',
            '/examples/state-management.md',
            '/examples/requests.md',
            '/examples/logging.md',
            '/examples/comprehensive.md'
          ]
        }
      ]
    }
  })
})