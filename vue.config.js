module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        extraResources: {
          from: './frp',
          to: './frp'
        }
      }
    }
  }
}
