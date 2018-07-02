<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title">Projects</h4>
              <p class="card-category">Manage projects</p>
            </template>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Published at</th>
                    <th colspan="2">Links</th>
                  </tr>
                </thead>
                <tbody>
                <tr v-for="project in this.projects" :key="project.id">
                  <td>
                    <router-link :to="{name: 'ProjectEdit', params : {id: project.id}}">
                      {{project.title}}
                    </router-link>
                  </td>
                  <td><span class="small" v-if="project.published_at">{{ project.published_at.date | moment('DD-MM-YYYY HH:mm' || '') }}</span></td>
                  <td>
                    <router-link class="btn btn-primary btn-fill btn-block btn-xs" :to="{name: 'ProjectEdit', params : {id: project.id}}">
                      <i class="fa fa-edit"></i>
                    </router-link>
                  </td>
                  <td>
                    <router-link class="btn btn-danger btn-fill btn-block btn-xs" :to="{name: 'ProjectEdit', params : {id: project.id}}">
                      <i class="fa fa-close"></i>
                    </router-link>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from 'src/components/UIComponents/Cards/Card.vue'
const tableColumns = ['Title', 'Published at', 'Links']
export default {
  components: {
    Card
  },
  data () {
    return {
      projects: [],
      tableColumns: [],
      table1: {
        columns: [...tableColumns],
        data: []
      }
    }
  },
  mounted () {
    this.$http({
      url: '/projects'
    }).then((response) => {
      this.projects = this.table1.data = response.data
    }).catch((error) => {
      console.log(error)
    })
  }

}
</script>

<style lang="scss" scoped>

</style>
