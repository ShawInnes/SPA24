import {vitePlugin as remix} from '@remix-run/dev';
import dotenvExpand from 'dotenv-expand';
import {loadEnv, defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({mode}) => {
  // This check is important!
  if (mode === 'development') {
    const env = loadEnv(mode, process.cwd(), '');
    dotenvExpand.expand({parsed: env});
  }

  return {
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
      tsconfigPaths(),
    ],
  };
});
