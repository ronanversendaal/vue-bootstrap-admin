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
// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'nav-item active'
})

Vue.router = router
// plugin setup
Vue.use(VueAxios, axios)
Vue.use(VueAuth, {
  auth: {
    request: function (req, token) {
      this.options.http._setHeaders.call(this, req, {
        Authorization: config.api.token
      })
    },
    response: function (res) {
      // Get Token from response body
      return res.data
    }
  },
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  loginData: { url: config.api.loginURL, fetchUser: false },
  fetchData: false,
  refreshData: { enabled: false }
})

Vue.use(LightBootstrap)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router
})
