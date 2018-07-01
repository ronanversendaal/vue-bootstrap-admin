<template>
  <div :id="`resource-gallery-dropzone-${album}`">
    <button 
      v-on:click="$upload.reset('resource-gallery')" 
      :disabled="$upload.meta('resource-gallery').status === 'sending'"
      class="btn btn-xs">
        Reset
    </button>

    <div 
      v-on:click="$upload.select('resource-gallery')"
      :disabled="$upload.meta('resource-gallery').status === 'sending'"
      class="jumbotron jumbotron-fluid">
      <div class="container">
        <p class="lead text-center" v-show="$upload.meta('resource-gallery').status === 'sending'">Uploading...</p>
        <p class="lead text-center" v-show="$upload.meta('resource-gallery').status !== 'sending'">Click or drag to upload</p>
        <p class="text-center" v-show="$upload.meta('resource-gallery').status !== 'sending'">Click on an album to switch destination</p>
      </div>
    </div>

    <div class="progress">
        <div class="progress-bar" :style="'width: ' + $upload.meta('resource-gallery').percentComplete + '%;'">
            {{ $upload.meta('resource-gallery').percentComplete }}% Complete
        </div>
    </div>

    <div>
        <div v-for="file in $upload.files('resource-gallery').progress">
            <div>
                {{ file.name }}
            </div>

            <div class="progress">
                <div class="progress-bar is-primary" :style="'width: ' + file.percentComplete + '%;'">
                    {{ file.percentComplete }}%
                </div>
            </div>
        </div>

        <div v-for="file in $upload.files('resource-gallery').queued">
            <div>
                {{ file.name }}
                <br/>
                Queued for upload
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'src/plugins/axios'
import { EventBus } from 'src/main'
import notificationMixin from 'src/mixins/notificationMixin.js'

export default {
  data () {
    return {
      resource: {},
      album: null
    }
  },
  mixins: [notificationMixin],
  mounted () {
    EventBus.$on('set-album', (options) => {
      this.album = options.id
      this.reset()
    })

    EventBus.$on('set-resource', (options) => {
      this.resource = options.resource

      this.$upload.new('resource-gallery', {
        async: true,
        maxFiles: 20,
        multiple: true,
        onSuccess (res) {
          EventBus.$emit('fetch-albums')
          this.notify('File upload complete.')
        },
        onEnd () {
          this.reset()
        },
        onError () {
          let gallery = this.$upload.files('resource-gallery')
          for (let i = 0; i < gallery.all.length; i++) {
            if (gallery.all[i].errors) {
              for (let e = 0; e < gallery.all[i].errors.length; e++) {
                this.notify(`Error for file ${gallery.all[i].name} : ${gallery.all[i].errors[e].message}`, 'warning')
              }
            }
          }
          this.reset()
        },
        http (data) {
          axios.post(data.url, data.body)
            .then(data.success)
            .catch(data.error)
        }
      })

      this.reset()
    })
  },
  methods: {
    reset () {
      let currentFilesLength = (this.resource.images) ? this.resource.images.length : 0
      this.$upload.reset('resource-gallery', {
        url: `/images/${this.album}`,
        currentFiles: currentFilesLength,
        dropzoneId: 'resource-gallery-dropzone-' + this.album
      })
    }
  },
  beforeDestroy () {
    this.$upload.reset('resource-gallery', {
      dropzoneId: null
    })
  }
}
</script>