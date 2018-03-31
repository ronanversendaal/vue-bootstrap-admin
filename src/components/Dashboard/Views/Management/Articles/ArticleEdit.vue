<template>
  <div class="content">
      <div>
          <form>
            <article class="tile is-child box">
              <h4 class="title">{{this.article.title}}</h4>

                <div class="field">
                  <label class="label">Title</label>
                  <div class="control has-icons-left has-icons-right">
                    <input class="input" name="title" type="text" v-model="article.title">
                  </div>
                </div>
                <div class="field">
                  <label class="label">Subtitle</label>
                  <div class="control has-icons-left has-icons-right">
                    <input class="input" name="subtitle" type="text" v-model="article.subtitle">
                  </div>
                </div>
                <div class="field">
                  <label class="label">Published</label>
                  <div class="control has-icons-left has-icons-right">
                    <label class="checkbox">
                      <input type="checkbox" @click="toggleIsPublishing" :checked="is_publishing">
                      Ready to publish
                    </label>
                  </div>
                  <p class="control">
                    <datepicker 
                      name="published_at" 
                      v-if="is_publishing"
                      v-model="article.published_at"
                      :config="{
                        enableTime: true, 
                        defaultDate : article.published_at, 
                        time_24hr: true, 
                        dateFormat: 'Y-m-d H:i:S' 
                        }"></datepicker>
                  </p>
                </div>
            </article>
            <div class="box">
                <h1 class="title">Edit article body</h1>
                <quill name="body" :options="{ theme: 'snow' }" ref="qc"></quill>

                <div class="field has-addons button-group">
                  <a class="button is-medium is-danger">
                    <span class="icon is-small">
                      <i class="fa fa-trash"></i>
                    </span>
                    <span>Delete</span>
                  </a>
                  <a @click="$router.history.go(-1)" class="button is-medium">
                    <span class="icon is-small">
                      <i class="fa fa-arrow-left"></i>
                    </span>
                    <span>Back</span>
                  </a>
                  
                  <a @click="saveForm" class="button is-medium  is-marginless is-info">
                    <span class="icon is-small">
                      <i class="fa fa-save"></i>
                    </span>
                    <span>Save</span>
                  </a>
              </div>
            </div>

          </form>
    </div>
  </div>
</template>

<script>
import Quill from 'vue-bulma-quill'
import Datepicker from 'vue-bulma-datepicker'

export default {
  components: {
    Datepicker, Quill
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
  created () {
    this.$http({
      url: '/articles/' + this.$route.params.id
    }).then((response) => {
      this.article = response.data
      // Sets current editor value with article body
      this.$refs.qc.editor.clipboard.dangerouslyPasteHTML(0, this.article.body)

      if (this.article.published_at !== null) {
        this.is_publishing = true
      }

      // Updates article body on change
      this.$refs.qc.editor.on('text-change', () => {
        this.article.body = this.$refs.qc.editor.container.firstChild.innerHTML
      })
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


<style lang="styl">
@import "~quill/assets/snow";
</style>
