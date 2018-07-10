var albumManagementMixin = {
  data () {
    return {
      currentAlbum: null
    }
  },
  methods: {
    createAlbum (resourceType) {
      let data = {}
      data[resourceType + '_id'] = this.resource.id
      return this.$http({
        method: 'POST',
        url: '/albums',
        data
      }).then((res) => {
        let album = res.data

        this.albums.push(album)
        this.setCurrentAlbum(album.id)
      })
    },
    fetchAlbums (resourceType, id) {
      return this.$http({
        url: `${resourceType}s/${id}/albums`
      })
    },
    deleteFromAlbum (imageId) {
      return this.$http({
        method: 'DELETE',
        url: `/images/${imageId}`
      })
    },
    deleteAlbum (albumId) {
      return this.$http({
        method: 'DELETE',
        url: `/albums/${albumId}`
      })
    },
    deleteImage (imageId) { // Put into own component which can handle the EventBus
      return this.deleteFromAlbum(imageId)
    },
    setCurrentAlbum (album) { // Put into own component which can handle the EventBus
      this.currentAlbum = album
    }
  }
}

module.exports = albumManagementMixin
