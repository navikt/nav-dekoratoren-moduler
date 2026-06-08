import typescript from "@rollup/plugin-typescript";
import { dts } from "rollup-plugin-dts";

import pkg from "./package.json" with { type: "json" };
import { packageVersionPlugin } from "./rollup.package-version-plugin.mjs";

const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });

export default [
    {
        input: "src/ssr/index.tsx",
        output: {
            name: "ssr",
            file: "ssr/index.js",
            format: "commonjs",
            sourcemap: true,
            exports: "named",
        },
        plugins: [
            packageVersionPlugin(),
            typescript({
                compilerOptions: {
                    declaration: false,
                    outDir: "ssr",
                    rootDirs: ["src/ssr", "src/common"],
                    rootDir: "src",
                },
                filterRoot: ".",
                include: ["src/common/**/*.(ts|tsx)", "src/ssr/**/*.(ts|tsx)"],
                exclude: ["**/*.test.ts"],
            }),
        ],
        external: ["fs", "react/jsx-runtime", ...deps],
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
