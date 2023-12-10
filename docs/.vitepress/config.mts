import { defineConfig } from 'vitepress';
import { getEntries } from './generate-sidebar';

const sidebar = getEntries('');

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Product Documentation',
  description: 'A VitePress Site',
  base: process.env.BASE_NAME,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config#outline
    outline: 'deep',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
    ],
    sidebar,
    socialLinks: [{ icon: 'github', link: 'https://github.com/ashalfarhan' }],
  },
});
