# spine_front_1

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### 关于跨域
在开发环境下，更改src/config.js的 apiBaseUrl: '/api',
在生产环境下，更改src/config.js的 apiBaseUrl: 'http://localhost:8000',

### 关于build
npm run build 作为vue的打包
npm run electron:build 作为electron的打包
注意: 在进行electron:build 的打包时需要将electron/main.js 的 let env = 'pro1' 只要不是'pro'就可以了
