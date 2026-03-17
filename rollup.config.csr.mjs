import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

import pkg from "./package.json" with { type: "json" };

const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }).filter(
    // Excluded so its runtime values are bundled rather than treated as an external require()
    (dep) => dep !== "@navikt/analytics-types",
);

export default [
    {
        input: "src/csr/index.tsx",
        output: {
            name: "csr",
            file: "csr/index.js",
            format: "umd",
            sourcemap: true,
            exports: "named",
            globals: {
                ["react"]: "React",
                ["js-cookie"]: "Cookies",
            },
        },
        plugins: [
            resolve(),
            typescript({
                compilerOptions: {
                    declaration: false,
                    outDir: "csr",
                    rootDirs: ["src/csr", "src/common"],
                    rootDir: undefined,
                    types: ["node"],
                },
                include: ["src/common/**/*.(ts|tsx)", "src/csr/**/*.(ts|tsx)"],
                exclude: ["**/*.test.ts"],
            }),
        ],
        external: deps,
    },
    {
        input: "src/csr/index.tsx",
        output: {
            name: "csr",
            file: "csr/index.d.ts",
        },
        plugins: [dts()],
    },
];
