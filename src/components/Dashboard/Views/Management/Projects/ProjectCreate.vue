<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <card>
            <template slot="header">
              <h4 class="card-title">Create new project</h4>
            </template>
            <form>
              <div class="row">
                <div class="col-sm-12">
                  <fg-input type="text"
                            label="Title"
                            placeholder="Title"
                            v-model="project.title">
                  </fg-input>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <fg-input type="text"
                            label="Heading"
                            placeholder="Heading"
                            v-model="project.head">
                  </fg-input>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <div class="form-group">
                    <label class="control-label">
                      project content
                    </label>

                    <vue-editor 
                    :customModules="customModulesForEditor"
                    :editorOptions="editorSettings" 
                    v-model="project.description">
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

import notificationMixin from 'src/mixins/notificationMixin.js'

export default {
  components: {
    Card,
    VueEditor
  },
  mixins: [publishingMixin, notificationMixin],
  data () {
    return {
      albums: [],
      project: {
        id: null,
        title: null,
        head: null,
        published_at: null,
        description: null
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
  created () {
    this.setInputTime()
  },
  methods: {
    saveForm () {
      const data = new URLSearchParams()

      this.project.published_at = this.getCurrentPublishing()

      for (let key in this.project) {
        data.append(key, this.project[key])
      }

      // Might set this in seperate layer.
      this.$http({
        method: 'POST',
        url: '/projects',
        data
      }).then((response) => {
        this.notify(`Project '${response.data.title}' saved!`)
        this.$router.push({name: 'ProjectEdit', params: {id: response.data.id}})
      }).catch((error) => {
        this.notify(`Could not save the project! <br/>${error.message}`, 'danger')
      })
    }
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
