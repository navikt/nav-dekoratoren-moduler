import typescript from "rollup-plugin-typescript2";

const pkg = require("./package.json");
let external = Object.keys(pkg.peerDependencies);

export default {
  input: ["src/csr/index.tsx"],
  output: {
    name: "csr",
    file: "csr/index.js",
    format: "umd",
    sourcemap: true,
    exports: "named",
    globals: {
      ["react"]: "React",
    },
  },
  plugins: [
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          outDir: "csr",
        },
        include: ["src/csr", "src/common-types.ts"],
      },
    }),
  ],
  external: external,
};
