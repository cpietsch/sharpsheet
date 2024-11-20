import terser from "@rollup/plugin-terser";
import meta from './package.json' assert { type: 'json' };

const config = {
  input: "src/sharpsheet.js",
  external: ["fs", "path", ...Object.keys(meta.dependencies || {})],
  output: {
    file: `dist/${meta.name}.js`,
    name: "sharpsheet",
    format: "cjs",
    indent: false,
    extend: true,
    banner: `// ${meta.homepage} v${
      meta.version
    } Copyright ${new Date().getFullYear()} ${meta.author.name}`,
  },
  plugins: [],
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      //file: `dist/${meta.name}.min.js`,
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner,
        },
      }),
    ],
  },
];
