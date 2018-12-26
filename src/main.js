// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import CyanoBridge from 'cyanobridge'


// 注册全局变量 cyanoBridge
var cyanoBridge = new CyanoMobile.CyanoBridge();
Vue.prototype.cyanoBridge = cyanoBridge;


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
