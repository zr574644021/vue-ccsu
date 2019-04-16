import Vue from 'vue';
import App from './App';
import router from './router/index';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';        // 默认主题
import '../static/css/search.css';
import '../static/css/icon-font/iconfont.css';
import 'assets/icon.css';
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import 'babel-polyfill';

Vue.use(ElementUI);
Vue.prototype.$axios = axios;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
