<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <card>
            <template slot="header">
              <h4 class="card-title">#{{this.article.id}} - {{this.article.title}}</h4>
              <p class="card-category">Edit article</p>
            </template>
            <form>
              <div class="row">
                <div class="col-sm-12">
                  <fg-input type="text"
                            label="Title"
                            placeholder="Title"
                            v-model="article.title">
                  </fg-input>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <fg-input type="text"
                            label="Subtitle"
                            placeholder="Subtitle"
                            v-model="article.subtitle">
                  </fg-input>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-8">
                  <fg-input type="date"
                            id="datepicker"
                            label="Publish date"
                            :value="toDateInputValue().slice(0, 10)">
                  </fg-input>
                </div>
                <div class="col-sm-4">
                  <fg-input type="time"
                            label="Published time"
                            :value="toDateInputValue().slice(11, 16)">
                  </fg-input>
                </div>
                <div class="col-sm-12">
                  <button @click="saveForm" class="btn btn-info btn-fill float-right">Save</button>
                </div>
              </div>
            </form>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Card from 'src/components/UIComponents/Cards/Card.vue'
// import Quill from 'vue-bulma-quill'
export default {
  components: {
    Card
    // Datepicker, Quill
  },
  data () {
    return {
      article: {
        id: null,
        title: null,
        subtitle: null,
        published_at: null,
        body: null
      },
      is_publishing: false
    }
  },
  methods: {
    toDateInputValue () {
      var local = new Date()
      local.setMinutes(local.getMinutes() - local.getTimezoneOffset())

      return local.toJSON()
    },
    toggleIsPublishing () {
      this.is_publishing = !this.is_publishing
    },
    saveForm () {
      const data = new URLSearchParams()

      for (let key in this.article) {
        // if (this.article[key] !== null) {
        if (key === 'published_at' && this.is_publishing === false) {
          this.article[key] = ''
        }
        data.append(key, this.article[key])
      }

      this.$http({
        method: 'PUT',
        url: '/articles/' + this.article.id,
        data
      }).then((response) => {
        console.log('Article saved!', response)
      }).catch((error) => {
        console.log(error)
      })
    }
  },
  mounted () {
  },
  created () {
    this.$http({
      url: '/articles/' + this.$route.params.id
    }).then((response) => {
      this.article = response.data

      if (this.article.published_at !== null) {
        this.is_publishing = true
      }
    }).catch((error) => {
      console.log(error)
    })
  }

}
</script>

<style lang="scss">
.field:not(:last-child) {
    margin-bottom: 0.75rem;
}
.button-group{
  padding: 1.25rem 0;
  &>.button{
    flex-grow: 1;
    min-width: 32.9%;
  }
}
</style>
