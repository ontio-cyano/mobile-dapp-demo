// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/**
 * 使用第三方库 eventproxy 来注册事件，让原生触发，这样可以接收来自原生的消息。
 * 这里为了将事件代理对象ep作为全局变量使用，放到Vue的protptype里。其它框架同理。
 */
var EventProxy = require('eventproxy')
var ep = new EventProxy();
Vue.prototype.ep = ep;

/**
 * 声明全局的事件触发方法。
 * @param {json object} content 原生返回给dapp的结果
 */
function emitMessage(content) {
  console.log('from native: ' + content);
  ep.emit('OntMessage', content);
}
window.emitMessage = emitMessage;
// import {
//   utils
// } from 'ontology-ts-sdk'
// var EventEmitter = new utils.EventEmitter();
// Vue.prototype.ee = EventEmitter;

// function emitMessage(content) {
//   console.log('from native: ' + content);
//   EventEmitter.emit('OntMessage', content);
// }


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
