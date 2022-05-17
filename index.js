import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import excludeDependenciesFromBundle from 'rollup-plugin-exclude-dependencies-from-bundle';
import ts from 'rollup-plugin-ts';
import typescript from '@rollup/plugin-typescript';

export const nodeBuiltIns = [
    'fs',
    'fs/promises',
    'worker_threads',
    'http',
    'https',
    'zlib',
    'path',
    'stream',
    'stream/web',
    'util',
    'url',
    'crypto',
    'process'
]
    .map(lib => [lib, `node:${lib}`])
    .flat();

export default ({
    terserConfig = {
        module: true,
        toplevel: true,
        compress: { unsafe: true },
        mangle: {}
    },
    additionalPlugins = []
}) => [
    {
        input: 'src/index.ts',
        external: nodeBuiltIns,
        plugins: [
            ...additionalPlugins,
            nodeResolve({ preferBuiltins: true, extensions: ['.ts', '.js', '.mjs', '.cjs'] }),
            ts(),
            excludeDependenciesFromBundle(),
            terser(terserConfig)
        ],
        output: { file: 'index.js', format: 'es', sourcemap: 'inline' }
    },
    {
        input: 'src/index.ts',
        external: nodeBuiltIns,
        plugins: [
            ...additionalPlugins,
            nodeResolve({ preferBuiltins: true, extensions: ['.ts'] }),
            typescript({ compilerOptions: { noEmit: true, declaration: false } }),
            excludeDependenciesFromBundle(),
            terser(terserConfig)
        ],
        output: { file: 'index.cjs', format: 'cjs', sourcemap: 'inline' }
    }
];
