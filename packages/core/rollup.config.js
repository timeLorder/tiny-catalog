import babel from '@rollup/plugin-babel';
import typescript2 from 'rollup-plugin-typescript2';
import tempDir from 'temp-dir';
import pkg from './package.json';
const { join } = require('path');

const cwd = process.cwd();
const input = 'src/index.ts';
const name = 'TinyCatalogCore';
const tsOpts = {
  cwd,
  clean: true,
  cacheRoot: `${tempDir}/.rollup_plugin_typescript2_cache`,
  tsconfig: join(cwd, 'tsconfig.json'),
  tsconfigOverride: {
    compilerOptions: {
      // Support dynamic import
      target: 'esnext',
    },
  },
  check: true,
};
const getBabelOpts = type => ({
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: { browsers: ['last 2 versions', 'IE 10'] },
        modules: type === 'es' ? false : 'auto',
      },
    ],
  ],
  plugins:
    type === 'es'
      ? [
          [
            require.resolve('@babel/plugin-transform-runtime'),
            {
              useESModules: true,
              version: require('@babel/runtime/package.json').version,
            },
          ],
        ]
      : [],
  babelHelpers: type === 'es' ? 'runtime' : 'bundled',
  exclude: /\/node_modules\//,
  babelrc: false,
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.es6', '.es', '.mjs'],
});

const rollupConfig = [
  {
    input,
    output: { name, file: pkg.main, format: 'cjs' },
    plugins: [typescript2(tsOpts), babel(getBabelOpts('cjs'))],
  },
  {
    input,
    output: { name, file: pkg.module, format: 'es' },
    plugins: [typescript2(tsOpts), babel(getBabelOpts('es'))],
    external: [/@babel\/runtime/],
  },
];

export default rollupConfig;
