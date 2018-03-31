<template>
  <div class="content has-text-centered">
      <div>
        <article class="tile is-child box" v-if="this.articles.length > 0">
          <h4 class="title">Table Responsive</h4>
          <div class="table-responsive">
            <table class="table is-bordered is-striped is-narrow">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Published at</th>
                  <th colspan="3">Links</th>
                </tr>
              </thead>
              <tfoot>
                <tr>
                  <th>Title</th>
                  <th>Published at</th>
                  <th colspan="3">Links</th>
                </tr>
              </tfoot>
              <tbody>
                <tr v-for="article in this.articles" :key="article.id">
                  <td>
                   <router-link :to="{ name: 'ArticleEdit', params : { id : article.id}}">{{article.title}}</router-link>
                  </td>
                  <td>
                    <router-link to="">{{article.published_at}}</router-link>
                  </td>
                  <td class="is-icon">
                    <a href="#">
                      <i class="fa fa-edit"></i>
                    </a>
                  </td>
                  <td class="is-icon">
                    <a href="#">
                      <i class="fa fa-close"></i>
                    </a>
                  </td>
                  <td class="is-icon">
                    <a href="#">
                      <i class="fa fa-globe"></i>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      articles: []
    }
  },
  mounted () {
    this.$http({
      url: '/articles'
    }).then((response) => {
      this.articles = response.data
      console.log(this.articles)
    }).catch((error) => {
      console.log(error)
    })
  }

}
</script>

<style lang="scss" scoped>

</style>
