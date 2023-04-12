const typescript = require("rollup-plugin-ts");
const terser = require("@rollup/plugin-terser");

const pkg = require("./package.json");
let external = Object.keys(pkg.dependencies);

module.exports = {
    input: ["src/rsc/index.tsx"],
    output: {
        name: "rsc",
        file: "rsc/index.js",
        format: "esm",
        sourcemap: true,
    },
    plugins: [
        typescript({
            tsconfig: (baseConfig) => ({
                ...baseConfig,
                outDir: "rsc",
                rootDirs: ["src/rsc", "src/common"],
            }),
            include: ["src/common/**/*.(ts|tsx)", "src/rsc/**/*.(ts|tsx)"],
        }),
        terser(),
    ],
    external: ["fs", ...external],
};
