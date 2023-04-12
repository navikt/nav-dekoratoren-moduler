const typescript = require("rollup-plugin-ts");
const terser = require("@rollup/plugin-terser");

const pkg = require("./package.json");
const external = Object.keys(pkg.dependencies);

module.exports = {
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
            tsconfig: (baseConfig) => ({
                ...baseConfig,
                outDir: "csr",
                rootDirs: ["src/csr", "src/common"],
            }),
            include: ["src/common/**/*.(ts|tsx)", "src/csr/**/*.(ts|tsx)"],
        }),
        terser(),
    ],
    external: external,
};
