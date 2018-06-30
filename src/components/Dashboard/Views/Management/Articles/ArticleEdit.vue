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
                <div class="col-sm-12">
                  <div class="form-group">
                    <label class="control-label">
                      Article content
                    </label>

                    <vue-editor 
                    :customModules="customModulesForEditor"
                    :editorOptions="editorSettings" 
                    v-model="article.body">
                    </vue-editor>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <UploadGallery :data="article" :type="'article'" />
                </div>
              </div>
              <div class="row">
                <div class="col-sm-8">
                  <fg-input type="date"
                            id="datepicker"
                            v-model="current.date"
                            label="Publish date">
                  </fg-input>
                </div>
                <div class="col-sm-4">
                  <fg-input type="time"
                            v-model="current.time"
                            label="Published time">
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

import { VueEditor } from 'vue2-editor-pure'
import { ImageDrop } from 'quill-image-drop-module'
import publishingMixin from 'src/mixins/publishingMixin.js'
import UploadGallery from 'src/Components/UIComponents/Inputs/UploadGallery'

import { EventBus } from 'src/main'

import notificationMixin from 'src/mixins/notificationMixin.js'

export default {
  components: {
    Card,
    VueEditor,
    UploadGallery
  },
  mixins: [publishingMixin, notificationMixin],
  data () {
    return {
      article: {
        id: null,
        title: null,
        subtitle: null,
        published_at: null,
        body: null
      },
      customModulesForEditor: [
        { alias: 'imageDrop', module: ImageDrop }
      ],
      editorSettings: {
        modules: {
          imageDrop: true
        }
      }
    }
  },
  methods: {
    saveForm () {
      const data = new URLSearchParams()

      this.article.published_at = this.getCurrentPublishing()

      for (let key in this.article) {
        data.append(key, this.article[key])
      }

      // Might set this in seperate layer.
      this.$http({
        method: 'PUT',
        url: '/articles/' + this.article.id,
        data
      }).then((response) => {
        this.notify(`Article '${response.data.title}' saved!`)
      }).catch((error) => {
        this.notify(`Could not save the article! <br/>${error.message}`, 'danger')
      })
    }
  },
  created () {
    this.$http({
      url: '/articles/' + this.$route.params.id
    }).then((response) => {
      this.article = response.data
      EventBus.$emit('set-resource', this.article)
      this.setInputTime(this.article.published_at)
    }).catch((error) => {
      this.notify(`Error connecting to server: <br/>${error.message}`, 'danger')
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
