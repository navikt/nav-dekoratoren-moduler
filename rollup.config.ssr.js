const typescript = require("rollup-plugin-ts");
const terser = require("@rollup/plugin-terser");

const pkg = require("./package.json");
const external = Object.keys(pkg.dependencies);

module.exports = {
    input: ["src/ssr/index.tsx"],
    output: {
        name: "ssr",
        file: "ssr/index.js",
        format: "cjs",
        sourcemap: true,
    },
    plugins: [
        typescript({
            tsconfig: (baseConfig) => ({
                ...baseConfig,
                outDir: "ssr",
                rootDirs: ["src/ssr", "src/common"],
            }),
            include: ["src/common/**/*.(ts|tsx)", "src/ssr/**/*.(ts|tsx)"],
        }),
        terser(),
    ],
    external: ["fs", ...external],
};
