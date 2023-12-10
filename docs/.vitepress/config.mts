import { defineConfig } from 'vitepress';
import { getEntries } from './generate-sidebar';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

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
  // buildEnd(siteConfig) {
  //   const assetsDir = join(siteConfig.themeDir, 'styles');
  //   const themeContent = readdirSync(assetsDir)
  //     .filter(f => f.endsWith('.css'))
  //     .map(f => readFileSync(join(assetsDir, f), { encoding: 'utf8' }))
  //     .join('\n');
  //   const cssFile = join(__dirname, 'dist', 'admin', 'styles.css');
  //   writeFileSync(cssFile, themeContent, { encoding: 'utf8' });
  //   console.log('Done write to admin/styles.css');
  // },
});
