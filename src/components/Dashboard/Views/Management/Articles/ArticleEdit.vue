<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <card>
            <template slot="header">
              <h4 class="card-title">#{{this.resource.id}} - {{this.resource.title}}</h4>
              <p class="card-category">Edit article</p>
            </template>
            <form>
              <div class="row">
                <div class="col-sm-12">
                  <fg-input type="text"
                            label="Title"
                            placeholder="Title"
                            v-model="resource.title">
                  </fg-input>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <fg-input type="text"
                            label="Subtitle"
                            placeholder="Subtitle"
                            v-model="resource.subtitle">
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
                    v-model="resource.body">
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
                  <button @click.prevent="saveForm" class="btn btn-info btn-fill float-right">Save</button>
                </div>
              </div>
            </form>
          </card>
          <card>
            <template slot="header">
              <h4 class="card-title">Manage images</h4>
            </template>
            
            <div>
              <button @click="createAlbum()" class="btn btn-primary">Create new album</button>
            </div>
                  
            <UploadGallery v-show="currentAlbum"/>
            <div v-for="album in albums" :key="album.id" class="album" :class="{ selected: album.id === currentAlbum}" @click="setCurrentAlbum(album.id)">
              <div class="row">
                <div v-for="image in album.images.data" :key="image.id" class="col-sm-4">
                  <button class="close">
                      <span aria-hidden="true" @click="deleteImage(image.id, album.id)">&times;</span>
                  </button>
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
import albumManagementMixin from 'src/mixins/albumManagementMixin.js'

export default {
  components: {
    Card,
    VueEditor,
    UploadGallery
  },
  mixins: [publishingMixin, notificationMixin, albumManagementMixin],
  data () {
    return {
      albums: [],
      resource: { // album
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
    deleteImage (imageId) {
      return this.deleteFromAlbum(imageId)
        .then((res) => {
          this.notify('Image deleted')
          EventBus.$emit('fetch-albums')
        })
        .catch((err) => {
          console.log(err)
          this.notify('Could not delete image', 'warning')
        })
    },
    setCurrentAlbum (album) {
      this.currentAlbum = album
      EventBus.$emit('set-album', {
        id: album
      })
    },
    saveForm () {
      const data = new URLSearchParams()

      this.resource.published_at = this.getCurrentPublishing()

      for (let key in this.resource) {
        data.append(key, this.resource[key])
      }

      // Might set this in seperate layer.
      this.$http({
        method: 'PUT',
        url: '/articles/' + this.resource.id,
        data
      }).then((response) => {
        this.notify(`Article '${response.data.title}' saved!`)
      }).catch((error) => {
        this.notify(`Could not save the article! <br/>${error.message}`, 'danger')
      })
    }
  },
  created () {
    EventBus.$on('fetch-albums', () => {
      this.fetchAlbums('article', this.$route.params.id).then(res => {
        if (res.data.data.length > 0) {
          this.albums = res.data.data
        }
      })
    })

    this.$http({
      url: '/articles/' + this.$route.params.id
    }).then((response) => {
      this.resource = response.data
      this.setInputTime(this.resource.published_at)

      return this.fetchAlbums('article', this.resource.id)
    })
      .then((response) => {
        if (response.data.first) {
          let albumId = response.data.first.id
          this.albums = response.data.data

          EventBus.$emit('set-resource', {
            resource: this.resource,
            id: albumId
          })

          this.setCurrentAlbum(albumId)
        }
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
  img{
    margin : 10px 0;
  }
  .close {
    border-radius: 25%;
    position: absolute;
    background: #333333;
    color: white;
    top: 0px;
    right: 10px;
    border-radius: 50%;
    padding: 0px 5px;
    opacity: 0.9;
    border: 2px solid white
  }
  &.selected{
   outline: 1px solid #333333;
  }
}
</style>
