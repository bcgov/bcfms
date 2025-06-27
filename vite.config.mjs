import { defineConfig, searchForWorkspaceRoot } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
const appRoot = '/web_root/bcfms';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import Components from 'unplugin-vue-components/vite';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';

export default defineConfig({
    optimizeDeps: {
        include: [
            'primevue/components/utils/DomHandler',
            /*'mod_arches', 'arches'*/
        ],
    },
    // publicDir: 'http://localhost:81/',
    // This is an URL, not directory
    base: '/bc-fossil-management/static',
    resolve: {
        // extensions: ['.js', '.json', '.ts','.vue'],
        preserveSymlinks: true, // This is the fix!
        alias: [
            {
                // This is to get out of the webpack/requireJS ecosystem
                find: /^.*\/root_vue.js$/,
                replacement: path.resolve(
                    path.join(appRoot, 'bcfms', 'src', 'root_vue.js'),
                ),
            },
            {
                // This is to get out of the webpack/requireJS ecosystem
                find: /^\/bcfms\/static\/build\/css/,
                replacement: path.resolve(
                    path.join(appRoot, 'bcfms', 'media', 'css'),
                ),
            },
            {
                // This is to get out of the webpack/requireJS ecosystem
                find: /^\/bcfms\/static\/css/,
                replacement: path.resolve(
                    path.join(appRoot, 'bcfms', 'media', 'css'),
                ),
            },
            {
                find: /^primevue/,
                replacement: path.resolve(
                    path.join(appRoot, 'node_modules', 'primevue'),
                ),
            },
            {
                find: /^@primevue/,
                replacement: path.resolve(
                    path.join(appRoot, 'node_modules', '@primevue'),
                ),
            },
            // {
            //     find: /.*\/primevue\/fieldset/,
            //     replacement: path.resolve(
            //         path.join(appRoot, 'node_modules', 'primevue', 'fieldset'),
            //     ),
            // },
            // {
            //     // This is to get out of the webpack/requireJS ecosystem
            //     find: /^.*\/output.css$/,
            //     replacement: path.resolve(
            //         path.join(appRoot, 'bcfms', 'media', 'css', 'output.css'),
            //     ),
            // },
            // {
            //     // This is to get out of the webpack/requireJS ecosystem
            //     find: /^.*\/project.css$/,
            //     replacement: path.resolve(
            //         path.join(appRoot, 'bcfms', 'media', 'css', 'project.css'),
            //     ),
            // },
            {
                find: /^.*\/node_modules/,
                replacement: path.resolve(path.join(appRoot, 'node_modules')),
            },
            {
                find: '@/arches_component_lab',
                replacement: path.resolve(
                    path.join(
                        __dirname,
                        './node_modules/arches-component-lab/arches_component_lab/src/arches_component_lab',
                    ),
                ),
            },
            {
                find: '@/arches',
                replacement: path.resolve(
                    path.join(
                        appRoot,
                        '..',
                        'arches',
                        'arches',
                        'app',
                        'src',
                        'arches',
                    ),
                ),
            },
            // This is to override the arches core AMD module with an ESM version
            {
                find: 'arches',
                replacement: path.resolve(
                    path.join(appRoot, 'bcfms', 'media', 'js', 'arches_esm'),
                ),
            },
            {
                find: 'utils/set-csrf-token_esm',
                replacement: path.resolve(
                    path.join(
                        appRoot,
                        'bcfms',
                        'media',
                        'js',
                        'utils',
                        'set-csrf-token_esm',
                    ),
                ),
            },
            // {
            //     find: 'arches2',
            //     replacement: path.resolve(
            //         path.join(
            //             appRoot,
            //             '..',
            //             'arches',
            //             'arches',
            //             'app',
            //             'media',
            //             'js',
            //             'arches_esm',
            //         ),
            //     ),
            // },
            // {
            //     find: 'utils/set-csrf-token2',
            //     replacement: path.resolve(
            //         path.join(
            //             appRoot,
            //             '..',
            //             'arches',
            //             'arches',
            //             'app',
            //             'media',
            //             'js',
            //             'utils',
            //             'set-csrf-token2',
            //         ),
            //     ),
            // },
            {
                find: '@/bcgov_arches_common',
                replacement: path.resolve(
                    path.join(
                        __dirname,
                        './node_modules/bcgov_arches_common/bcgov_arches_common/src/bcgov_arches_common',
                    ),
                ),
            },
            {
                find: '@/bcfms',
                replacement: path.resolve(
                    path.join(__dirname, './bcfms/src/bcfms'),
                ),
            },
        ],
    },
    plugins: [
        vue(),
        cssInjectedByJsPlugin({ jsAssetsFilterFunction: () => true }),
        Components({
            resolvers: [PrimeVueResolver()],
        }),
    ],
    ssr: { optimizeDeps: { noDiscovery: false } },
    server: {
        root: path.resolve('./bcfms/src'),
        host: 'localhost',
        port: 5174,
        open: false,
        cors: true,
        base: '/bc-fossil-management/static',
        origin: 'http://localhost:81',
        watch: {
            usePolling: true,
            disableGlobbing: false,
            ignored: ['**/*.log', '.idea/workspace.xml'],
        },
        deps: {
            inline: ['node', 'arches'],
        },
        // Force all API calls back to the Arches Dev server
        // These are internal URLs - don't use docker mapped port
        proxy: {
            '/bc-fossil-management/arches-component-lab/api': 'http://localhost:80',
            '/bc-fossil-management/api': 'http://localhost:80',
            '/bc-fossil-management/static/css': 'http://localhost:80',
        },
        fs: {
            allow: [
                searchForWorkspaceRoot(process.cwd()),
                '/web_root/arches_common/bcgov_arches_common/media',
                '/web_root/arches/arches/app',
                '/web_root/bcfms/bcfms/media',
                '/web_root/bcfms/node_modules',
            ],
        },
    },
    appType: 'mpa',
    build: {
        outDir: path.resolve('./bcfms/staticfiles/dist'),
        cssCodeSplit: false,
        // ssrManifest: 'manifest.json',
        sourcemap: true,
        assetsDir: '',
        manifest: 'manifest.json',
        // manifest: true,
        emptyOutDir: true,
        target: 'es2015',
        appType: 'mpa',
        commonjsOptions: {
            transformMixedEsModules: true,
            include: [/.*arches\.js/, /arches/, /views\/root.js/, /.*quill.*/],
            extensions: ['.js', '.cjs'],
            esmExternals: true,
        },
        rollupOptions: {
            input: {
                // main: path.resolve('./bcfms/media/js/views/root.js'),
                main: path.resolve('./bcfms/src/root_vue.js'),
                // main: path.resolve('./bcfms/src/root.js'),
                // main_css: path.resolve('./bcfms/media/css/output.css'),
            },
            output: {
                chunkFileNames: undefined,
            },
        },
    },
});
