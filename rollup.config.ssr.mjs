import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { dts } from "rollup-plugin-dts";

import pkg from "./package.json" with { type: "json" };

const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

export default [
    {
        input: "src/ssr/index.tsx",
        output: {
            name: "ssr",
            file: "ssr/index.js",
            format: "cjs",
            sourcemap: true,
        },
        plugins: [
            typescript({
                compilerOptions: {
                    declaration: false,
                    outDir: "ssr",
                    rootDirs: ["src/ssr", "src/common"],
                    rootDir: undefined,
                },
                include: ["src/common/**/*.(ts|tsx)", "src/ssr/**/*.(ts|tsx)"],
            }),
            // terser(),
        ],
        external: ["fs", ...deps],
    },
    {
        input: "src/ssr/index.tsx",
        output: {
            name: "ssr",
            file: "ssr/index.d.ts",
        },
        plugins: [dts()],
    },
];
