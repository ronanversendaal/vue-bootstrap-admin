<template>
  <div :id="`resource-gallery-dropzone-${album}`">
    <button 
      v-on:click="$upload.reset('resource-gallery')" 
      :disabled="$upload.meta('resource-gallery').status === 'sending'"
      class="btn btn-xs">
        Clear
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

    <div v-if="$upload.errors('resource-gallery').length" class="text-danger">
        {{ $upload.errors('resource-gallery')[0].message }}
    </div>

    <div>
        <div v-if="!$upload.files('resource-gallery').all.length">
            No uploads here yet.
        </div>

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

        <div v-for="file in $upload.files('resource-gallery').complete">
            <div v-if="file.errors.length">
                {{ file.name }}
                <br/>
                {{ file.errors[0].message }}
            </div>
            
            <div v-if="!file.errors.length">
                {{ file.name }}
                <br/>
                Uploaded successfully.
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
        onStart () {
          // this.$toggle.show('resource:media:uploads')
        },
        onSuccess (res) {
          this.resource.images.push(res.data.data)
          this.notify('File upload complete.')
        },
        onEnd () {
          this.notify('File handling complete.', 'info')
          this.reset()
        },
        onError (error) {
          this.notify(`An error occured while uploading: ${error}`, 'danger')
        },
        http (data) {
          axios.post(data.url, data.body)
            .then(data.success)
            .catch(data.error)
        },
        parseErrors (errors) {
          // console.log(errors)
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