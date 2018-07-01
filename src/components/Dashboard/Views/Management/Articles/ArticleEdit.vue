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
          <card>
            <template slot="header">
              <h4 class="card-title">Manage images</h4>
            </template>
                  
            <UploadGallery />
            <div v-for="album in albums" :key="album.id" class="album" :class="{ selected: album.id === currentAlbum}">
              <div class="row" @click="setCurrentAlbum(album.id)">
                <div v-for="image in album.images.data" :key="image.id" class="col-sm-4">
                  <img :src="image.path" class="img-fluid" />
                </div>
              </div>
            </div>
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
      currentAlbum: null,
      albums: [],
      article: {
        id: null,
        title: null,
        subtitle: null,
        published_at: null,
        body: null,
        images: {}
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
    setCurrentAlbum (album) {
      this.currentAlbum = album
      EventBus.$emit('set-album', {
        id: album
      })
    },
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
      this.setInputTime(this.article.published_at)

      return this.$http({
        url: '/articles/' + this.$route.params.id + '/albums'
      })
    })
      .then((response) => {
        let albumId = response.data.first.id
        this.albums = response.data.data

        EventBus.$emit('set-resource', {
          resource: this.article,
          id: albumId
        })

        this.setCurrentAlbum(albumId)
      })
      .catch((error) => {
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

.album{
  margin: 15px 0;
  padding: 15px;
  &.selected{
   outline: 1px solid #333333; 
  }
}
</style>
