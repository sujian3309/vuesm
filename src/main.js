//挂载vue 所有的挂载代码写在最前面
import Vue from 'vue'
//挂载App.vue
import App from './App.vue'
//挂载  ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//挂载路由
import router from './router'
Vue.config.productionTip = false;
//render函数免去了vue虚拟DOM的转译过程
Vue.use (ElementUI);
new Vue ({
  router,
  render: h => h(App)
}) .$mount('#app');