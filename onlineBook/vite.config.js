import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server:{
    host:'127.0.0.1',
    port:8083,
    https:false,
    open:false,
    proxy:{
      '/api':{
        target:'http://127.0.0.1:8080',
        //是否允许跨域，在本地会创建一个虚拟服务器，然后发送数据请求
        changeOrigin:true,
        ws:true,
        rewrite:(path)=>path.replace(/^\/api/,"")
      }
    }
  }
  
})
