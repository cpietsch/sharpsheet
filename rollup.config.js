import terser from "@rollup/plugin-terser";
import { readFileSync } from 'fs';
const meta = JSON.parse(readFileSync('./package.json', 'utf8'));

const config = {
  input: "src/sharpsheet.js",
  external: ["fs", "path", ...Object.keys(meta.dependencies || {})],
  plugins: [],
};

const banner = `// ${meta.homepage} v${
  meta.version
} Copyright ${new Date().getFullYear()} ${meta.author.name}`;

export default [
  // CommonJS build
  {
    ...config,
    output: {
      file: 'dist/sharpsheet.js',
      format: 'cjs',
      exports: 'auto',
      banner
    }
  },
  // ESM build
  {
    ...config,
    output: {
      file: 'dist/sharpsheet.mjs',
      format: 'esm',
      banner
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: banner,
        },
      }),
    ]
  }
];
