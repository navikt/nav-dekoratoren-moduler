import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

import pkg from "./package.json" with { type: "json" };

const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

export default [
    {
        input: "src/csr/index.tsx",
        output: {
            name: "csr",
            file: "csr/index.js",
            format: "es",
            sourcemap: true,
            exports: "named",
            globals: {
                ["react"]: "React",
            },
        },
        plugins: [
            typescript({
                compilerOptions: {
                    declaration: false,
                    outDir: "csr",
                    rootDirs: ["src/csr", "src/common"],
                    rootDir: undefined,
                },
                include: ["src/common/**/*.(ts|tsx)", "src/csr/**/*.(ts|tsx)"],
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
