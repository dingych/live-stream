import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from '@/router/'

Vue.prototype.$http= axios
new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
console.log("与其自己开发不如关注应用http://www.softworld.vip")