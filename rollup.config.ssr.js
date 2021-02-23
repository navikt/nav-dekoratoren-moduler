import typescript from "@rollup/plugin-typescript";

const pkg = require("./package.json");
let external = Object.keys(pkg.peerDependencies);

export default {
  input: ["src/ssr.tsx"],
  output: {
    dir: "ssr",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    typescript({
      outDir: "ssr",
    }),
  ],
  external: external,
};
