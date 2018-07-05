<template>
  <div class="content">
    <div class="container-fluid">
      <card>
        <h4 slot="header" class="card-title">Login</h4>
        <form>
          <div class="alert alert-warning" v-if="error">
            <button type="button" aria-hidden="true" class="close">×</button>
            <span><b> Warning - </b>{{error}}</span>
          </div>
          <div class="row">
            <div class="col-md-12">
              <fg-input type="text"
                        autocomplete='email'
                        label="Emailaddress"
                        placeholder="Emailaddress"
                        v-model="data.user.email">
              </fg-input>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <fg-input type="text"
                        label="Password"
                        placeholder="Password"
                        v-model="data.user.password">
              </fg-input>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <checkbox v-model="data.rememberMe" :inline="true">Remember me</checkbox>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12">
              <div class="text-center">
                <button type="submit" class="btn btn-primary btn-fill float-right" @click.prevent="login">
                  Login
                </button>
              </div>
            </div>
          </div>
          
          
          <div class="clearfix"></div>
        </form>
      </card>
    </div>
  </div>
</template>


<script>
import Card from 'src/components/UIComponents/Cards/Card.vue'
import Checkbox from 'src/components/UIComponents/Inputs/Checkbox.vue'
export default {
  components: {
    Card, Checkbox
  },
  data () {
    return {
      data: {
        user: {
          email: null,
          password: null
        },
        rememberMe: false
      },
      error: null
    }
  },
  mounted () {
    if (this.$auth.redirect()) {
    }
    // Can set query parameter here for auth redirect or just do it silently in login redirect.
  },
  methods: {
    login () {
      var redirect = this.$auth.redirect()
      this.$auth.login({
        headers: {
          'Content-Type': 'application/json'
        },
        data: this.data.user,
        rememberMe: this.data.rememberMe,
        redirect: {name: redirect ? redirect.from.name : 'Overview'},
        success (res) {
          this.$auth.token('default_auth_token', res.data.access_token)
        },
        error (err) {
          if (err) {
            this.error = err.response.data.error
          } else {
            // Something happened in setting up the request that triggered an Error

          }
        }
      })
    }
  }
}
</script>

<style>
</style>
