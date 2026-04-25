import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue';

import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

import type { UserConfig } from 'vitest/config';

function generateConfig(): Promise<UserConfig> {
    return new Promise((resolve, reject) => {
        const filePath = path.dirname(fileURLToPath(import.meta.url));

        const exclude = [
            '**/*.d.ts',
            '**/node_modules/**',
            '**/dist/**',
            '**/install/**',
            '**/cypress/**',
            '**/.{idea,git,cache,output,temp}/**',
            '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
            '**/build/**',
            '**/staticfiles/**',
            'tests/playwright/**',
        ];

        const rawData = fs.readFileSync(
            path.join(
                __dirname,
                'frontend_configuration',
                'webpack-metadata.json',
            ),
            'utf-8',
        );
        const parsedData = JSON.parse(rawData);

        // Exclude test files from external Arches application dependencies
        // (those whose source trees live outside this project's directory).
        for (const appPath of Object.values(
            parsedData['ARCHES_APPLICATIONS_PATHS'] as {
                [key: string]: string;
            },
        )) {
            const resolved = path.resolve(filePath, appPath);
            if (!resolved.startsWith(filePath)) {
                exclude.push(path.join(resolved, '**'));
            }
        }

        const alias: { [key: string]: string } = {
            '@/arches': path.join(
                parsedData['ROOT_DIR'],
                'app',
                'src',
                'arches',
            ),
            arches: path.join(
                parsedData['ROOT_DIR'],
                'app',
                'media',
                'js',
                'arches.js',
            ),
        };

        for (const [
            archesApplicationName,
            archesApplicationPath,
        ] of Object.entries(
            parsedData['ARCHES_APPLICATIONS_PATHS'] as {
                [key: string]: string;
            },
        )) {
            alias[`@/${archesApplicationName}`] = path.join(
                archesApplicationPath,
                'src',
                archesApplicationName,
            );
        }

        // Override app aliases using paths from tsconfig.json (body only —
        // no extends resolution, so the missing build-generated
        // frontend_configuration/tsconfig-paths.json is never touched).
        // bcfms/tsconfig.json overrides the generated live-source paths with
        // installed node_modules paths for external apps, using the correct
        // npm package name (e.g. arches-component-lab, not arches_component_lab).
        // Reading it here keeps Vitest's aliases consistent with TypeScript's.
        const tsconfigText = fs.readFileSync(
            path.join(filePath, 'tsconfig.json'),
            'utf-8',
        );
        // tsconfig uses JSONC — strip // line comments before parsing.
        const tsconfigJson = JSON.parse(
            tsconfigText.replace(/\/\/[^\n]*/g, ''),
        );
        const tsconfigPaths: Record<string, string[]> =
            tsconfigJson.compilerOptions?.paths ?? {};
        for (const [pattern, targets] of Object.entries(tsconfigPaths)) {
            if (
                pattern.startsWith('@/') &&
                pattern.endsWith('/*') &&
                targets.length > 0
            ) {
                const aliasKey = pattern.slice(0, -2); // strip trailing /*
                const target = targets[0].replace(/\/\*$/, ''); // strip trailing /*
                alias[aliasKey] = path.join(filePath, target);
            }
        }

        resolve({
            plugins: [vue() as any],
            esbuild: {
                tsconfigRaw: {
                    compilerOptions: {
                        target: 'ESNext',
                        jsx: 'preserve',
                        jsxImportSource: 'vue',
                        useDefineForClassFields: true,
                        verbatimModuleSyntax: true,
                    },
                },
            },
            test: {
                alias: alias,
                coverage: {
                    include: [
                        path.join(
                            parsedData['APP_RELATIVE_PATH'],
                            'src',
                            path.sep,
                        ),
                    ],
                    exclude: exclude,
                    reporter: [['clover', { file: 'coverage.xml' }], 'text'],
                    reportsDirectory: path.join(
                        filePath,
                        'coverage',
                        'frontend',
                    ),
                },
                environment: 'jsdom',
                globals: true,
                exclude: exclude,
                passWithNoTests: true,
                setupFiles: ['vitest.setup.mts'],
            },
        });
    });
}

export default (async () => {
    const config = await generateConfig();
    return defineConfig(config);
})();
