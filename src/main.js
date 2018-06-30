import config from '../config/keys'

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'

// LightBootstrap plugin
import LightBootstrap from './light-bootstrap-main'
import axios from './plugins/axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
// router setup
import routes from './routes/routes'

Vue.use(VueRouter)
Vue.use(require('vue-moment'))
Vue.use(require('@websanova/vue-upload'))
// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

Vue.router = router
// plugin setup
Vue.use(VueAxios, axios)
Vue.use(VueAuth, {
  auth: require('@websanova/vue-auth/drivers/auth/bearer'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: config.api.loginURL, fetchUser: false },
  fetchData: false,
  refreshData: { enabled: false }
})

Vue.use(LightBootstrap)

export const EventBus = new Vue()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
