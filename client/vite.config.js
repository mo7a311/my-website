import { defineConfig } from 'vite';
import prerender from 'vite-plugin-prerender';
import path from 'path';

export default defineConfig({
  base: '/my-website/', // Required for GitHub Pages deployment under a repo
  plugins: [
    prerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: ['/'],
      renderer: new prerender.PuppeteerRenderer({
        renderAfterTime: 3000, // Waits 3 seconds for client to fetch data and render leafet map
        headless: true
      })
    })
  ]
});
