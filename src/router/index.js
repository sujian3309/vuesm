import Vue from 'vue'
import Router from 'vue-router'
Vue.use (Router)
export default new Router ({
  //配置路由
  routes: [
    {
      // 给路由起个名字
      name: 'home',
      path: '/home',
      //再整个项目中，模块路径中的，@表示是src目录
      //无论你当前模块在哪里，@都可以直接定位到src
      //加载一个目录可以默认加载她的，index.js, index.vue, index.json
      component: () => import('@/views/home')
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
