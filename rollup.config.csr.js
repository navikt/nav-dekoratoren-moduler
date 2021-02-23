import typescript from "@rollup/plugin-typescript";

const pkg = require("./package.json");
let external = Object.keys(pkg.peerDependencies);

export default {
  input: ["src/index.tsx"],
  output: {
    dir: "csr",
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    typescript({
      outDir: "csr",
    }),
  ],
  external: external,
};
