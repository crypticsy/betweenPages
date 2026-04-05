import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Set BASE to the repo name when deploying to GitHub Pages.
// Override with VITE_BASE env var for a custom domain (set to '/').
const base = process.env.VITE_BASE ?? '/betweenPages/';

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
