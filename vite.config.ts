import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

export default defineConfig(async () => {
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    css: { postcss: { plugins: [tailwindcss()] } },
    server: { host: '0.0.0.0', port: 3000 },
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: {
          name: 'tesoob-temp',
          main: 'vinext/server/fetch-handler',
          compatibility_date: '2026-09-22',
          compatibility_flags: ['nodejs_compat'],
          d1_databases: [{
            binding: 'DB',
            database_name: 'tesoob-temp',
            database_id: '00106da8-38d5-4e33-9d2b-d0e81304b723',
          }],
        },
      }),
    ],
  };
});
