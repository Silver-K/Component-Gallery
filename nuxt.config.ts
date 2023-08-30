// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  vite: {
    server: {
      proxy: {
        '/turing/resource': {
          target: 'https://obs-9be7.obs.cn-east-2.myhuaweicloud.com',
          changeOrigin: true,
          secure: false,
        },
      }
    }
  }
})
