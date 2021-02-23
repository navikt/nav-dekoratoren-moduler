import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";

const pkg = require("./package.json");
let external = Object.keys(pkg.devDependencies);

export default {
  input: pkg.source,
  output: {
    dir: "lib",
    format: "cjs",
  },
  plugins: [typescript()],
  external: external,
};
