var publishingMixin = {
  data () {
    return {
      current: {
        date: null,
        time: null
      }
    }
  },
  methods: {
    getCurrentPublishing () {
      if (this.current.date) {
        var dateTime = this.current.date

        if (this.current.time) {
          dateTime = this.current.date + 'T' + this.current.time
        }
        return this.$moment(dateTime).format('YYYY-MM-DD HH:mm:ss')
      } else if (this.current.date === '') {
        return null
      }
    },
    setInputTime (existingTimestamp) {
      var local = this.$moment()

      if (existingTimestamp) {
        local = this.$moment(existingTimestamp)
      }

      this.current.date = local.format('YYYY-MM-DD')
      this.current.time = local.format('HH:mm')
    },
    toggleIsPublishing () {
      this.current.is_publishing = !this.current.is_publishing
    }
  }
}

module.exports = publishingMixin
