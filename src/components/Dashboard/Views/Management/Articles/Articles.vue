<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <card>
            <template slot="header">
              <h4 class="card-title">Articles
                  <router-link :to="{name: 'ArticleCreate'}" class="btn btn-success btn-fill pull-right">
                    <i class="fa fa-plus"></i> Create
                  </router-link>
              </h4>
              <p class="card-category">Manage publishings</p>
            </template>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Published at</th>
                    <th colspan="2">Links</th>
                  </tr>
                </thead>
                <tbody>
                <tr v-for="article in this.articles" :key="article.id">
                  <td>
                    <router-link :to="{name: 'ArticleEdit', params : {id: article.id}}">
                      {{article.title}}
                    </router-link>
                  </td>
                  <td><span class="small" v-if="article.published_at">{{article.published_at.date | moment('DD-MM-YYYY HH:mm') }}</span></td>
                  <td>
                    <router-link class="btn btn-primary btn-fill btn-block btn-xs" :to="{name: 'ArticleEdit', params : {id: article.id}}">
                      <i class="fa fa-edit"></i>
                    </router-link>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-fill btn-block btn-xs" v-confirm="{loader : true, ok: dialog => deleteArticle(dialog, article.id), message: 'Are you sure you want to delete this resource?'}">
                      <i class="fa fa-close"></i>
                    </button>
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
      articles: [],
      tableColumns: [],
      table1: {
        columns: [...tableColumns],
        data: []
      }
    }
  },
  methods: {
    deleteArticle (dialog, id) {
      return this.$http({
        method: 'DELETE',
        url: `/articles/${id}`
      }).then((response) => {
        this.notify('Resource deleted')
        return this.fetchArticles();
      }).catch((error) => {
        this.notify(error.message, 'warning')
      }).finally(() => {
        dialog.close();
      })
    },
    fetchArticles () {
      return this.$http({
        url: '/articles'
      }).then((response) => {
        this.articles = this.table1.data = response.data
      }).catch((error) => {
        this.notify(error.message, 'danger')
      })
    }
  },
  mounted () {
    this.fetchArticles()
  }

}
</script>

<style lang="scss" scoped>

</style>
