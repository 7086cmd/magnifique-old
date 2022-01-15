import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import styleImport from 'vite-plugin-style-import'
import lagacy from '@vitejs/plugin-legacy'

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        styleImport({
            libs: [
                {
                    libraryName: 'vant',
                    esModule: true,
                    resolveStyle: (name) => `vant/es/${name}/style/index`,
                },
            ],
        }),
        lagacy({
            targets: ['defaults'],
            additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        }),
    ],
    server: {
        fs: {
            strict: false,
        },
    },
    build: {
        outDir: './dist/pages',
    },
})
