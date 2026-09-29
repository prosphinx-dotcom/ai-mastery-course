import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Capacitor serves from the app bundle; relative paths keep assets resolvable.
  base: './',
  build: { target: 'es2022' },
});
