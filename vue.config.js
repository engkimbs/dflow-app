process.env.VUE_APP_VERSION = process.env.npm_package_version

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.lucorda.dflow.app",
        artifactName: "dflow-app-${version}.${ext}",
        publish: [
          {
            provider: 'github',
            owner: 'engkimbs',
            private: true,
          }
        ],
      },
      preload: "src/preload.js"
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
};
