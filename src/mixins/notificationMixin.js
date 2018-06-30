var notificationMixin = {
  methods: {
    notify (message, customType) {
      let type = ''
      let types = ['info', 'warning', 'danger', 'success']
      let icon = ''

      types.find((type) => {
        return customType === type
      })

      switch (customType) {
        case 'info':
          icon = 'fa fa-inverse fa-exclamation-circle'
          type = 'info'
          break
        case 'warning':
          icon = 'fa fa-inverse fa-exclamation-triangle'
          type = 'warning'
          break
        case 'danger':
          icon = 'fa fa-inverse fa-exclamation-triangle'
          type = 'danger'
          break
        default: // success
          icon = 'nc-icon nc-check-2'
          type = 'success'
          break
      }

      return this.$notifications.notify({
        component: {
          template: `<span>${message}</span>`
        },
        icon,
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type
      })
    }
  }
}

module.exports = notificationMixin
