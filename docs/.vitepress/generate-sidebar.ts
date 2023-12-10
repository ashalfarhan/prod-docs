import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DIRECTORY = 'docs';
const IGNORE_LIST = ['.vitepress', 'images', 'public'];

function getTitleFromFile(file: string) {
  if (!existsSync(file)) return;
  const content = readFileSync(file, { encoding: 'utf8' });
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const frontmatterPrefix = 'title: ';
    if (line.startsWith(frontmatterPrefix)) {
      return line.substring(frontmatterPrefix.length);
    }
    const heading1Prefix = '# ';
    if (line.startsWith(heading1Prefix)) {
      return line.substring(heading1Prefix.length);
    }
  }
}

// function getTitleFromDirectory(directory: string, name: string) {
//   const indexFile = join(directory, 'index.md');
//   if (existsSync(indexFile)) return getTitleFromFile(indexFile)!;
//   console.log({ name, directory });
//   const cleanSlug = name.replace(/[_-]/g, ' ');
//   const text = cleanSlug
//     .split(' ')
//     // Capitalize
//     .map(w => w.charAt(0).toUpperCase() + w.slice(1))
//     .join(' ');
//   return text;
// }

type SidebarItem = { text: string; link?: string; items?: SidebarItem[] };

export function getEntries(base: string) {
  const entries = readdirSync(join(DIRECTORY, base));
  const result: SidebarItem[] = [];
  for (let i = 0; i < entries.length; i++) {
    const fullPath = join(DIRECTORY, base, entries[i]);
    if (base === '' && entries[i] === 'index.md') continue;
    if (statSync(fullPath).isDirectory()) {
      if (IGNORE_LIST.includes(entries[i])) {
        continue;
      }
      const fullDir = join(DIRECTORY, base, entries[i]);
      const indexFile = join(fullDir, 'index.md');
      let text: string;
      let link: string | undefined;
      if (existsSync(indexFile)) {
        text = getTitleFromFile(indexFile)!;
        link = '/' + join(base, entries[i]) + "/";
      } else {
        const cleanSlug = entries[i].replace(/[_-]/g, ' ');
        text = cleanSlug
          .split(' ')
          // Capitalize
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }
      result.push({
        text,
        items: getEntries(entries[i]),
        link,
      });
      continue;
    }
    const [filename, ext] = entries[i].split('.');
    if (filename === 'index') continue;
    if (ext && ext.toLowerCase() === 'md') {
      const text = getTitleFromFile(join(DIRECTORY, base, entries[i]));
      if (!text) throw new Error(`Cannot get text from entry: "${entries[i]}"`);
      result.push({
        text,
        link: '/' + join(base, filename),
      });
    }
  }

  return result.sort((a, b) => {
    if (a.items && !b.items) return 1;
    if (!a.items && b.items) return -1;
    return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
  });
}
