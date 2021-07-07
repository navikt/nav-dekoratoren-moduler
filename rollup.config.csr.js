import typescript from "rollup-plugin-ts";

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
            tsconfig: baseConfig => ({
                ...baseConfig,
                outDir: "csr",
                rootDirs: ['src/csr', 'src/common'],
            }),
            include: ['src/common/**/*.(ts|tsx)', 'src/csr/**/*.(ts|tsx)']
        }),
    ],
    external: external,
};
