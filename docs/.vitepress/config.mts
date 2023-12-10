import { defineConfig } from 'vitepress';
import { getEntries } from './generate-sidebar';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const sidebar = getEntries('');

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Product Documentation',
  description: 'A VitePress Site',
  base: process.env.BASE_NAME || '/prod-docs/',
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
  buildEnd(siteConfig) {
    const assetsDir = join(__dirname, 'dist', 'assets');
    let cssFile = readdirSync(assetsDir).find(f => f.endsWith('.css'));
    if (!cssFile) throw new Error('Cannot find css file');
    if (siteConfig.userConfig.base) {
      cssFile = join(siteConfig.userConfig.base, 'assets', cssFile);
    }
    const cmsPage = join(__dirname, 'dist', 'admin', 'index.html');
    const file = readFileSync(cmsPage, { encoding: 'utf8' });
    const rewrotedFile = file.replace('{{css}}', cssFile);
    writeFileSync(cmsPage, rewrotedFile, { encoding: 'utf8' });
    console.log('Done rewrote CMS Page');
  },
});
