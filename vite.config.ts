import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react'
// @ts-types="vite-plugin-glsl"
import glsl from 'vite-plugin-glsl';
// @ts-types="vite-plugin-wasm"
import wasm from 'vite-plugin-wasm';

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react(), glsl(), wasm()],
})
