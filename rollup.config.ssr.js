import typescript from "rollup-plugin-ts";

const pkg = require("./package.json");
let external = Object.keys(pkg.peerDependencies);

export default {
    input: ["src/ssr/index.tsx"],
    output: {
        name: "ssr",
        file: "ssr/index.js",
        format: "cjs",
        sourcemap: true,
    },
    plugins: [
        typescript({
            tsconfig: baseConfig => ({
                ...baseConfig,
                outDir: "ssr",
                rootDirs: ['src/ssr', 'src/common'],
            }),
            include: ['src/common/**/*.(ts|tsx)', 'src/ssr/**/*.(ts|tsx)']
        }),
    ],
    external: ["fs", ...external],
};
