import typescript from "rollup-plugin-typescript2";

const pkg = require("./package.json");
let external = Object.keys(pkg.peerDependencies);

export default {
  input: ["src/ssr/index.tsx"],
  output: {
    name: "ssr",
    file: "ssr/index.js",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          outDir: "csr",
          rootDir: "src/ssr",
        },
        include: ["src/ssr"],
      },
    }),
  ],
  external: external,
};
