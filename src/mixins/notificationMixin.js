var notificationMixin = {
  methods: {
    notify (notificationMessage, notificationType) {
      let icon = ''

      switch (notificationType) {
        case 'info':
          icon = 'fa fa-inverse fa-exclamation-circle'
          break
        case 'warning':
          icon = 'fa fa-inverse fa-exclamation-triangle'
          break
        case 'danger':
          icon = 'fa fa-inverse fa-exclamation-triangle'
          break
        default: // success
          icon = 'nc-icon nc-check-2'
          notificationType = 'success'
          break
      }

      return this.$notifications.notify({
        component: {
          template: `<span>${notificationMessage}</span>`
        },
        icon,
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: notificationType
      })
    }
  }
}

module.exports = notificationMixin
