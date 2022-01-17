process.env.VUE_APP_VERSION = process.env.npm_package_version

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        appId: "com.lucorda.dflow.app",
        artifactName: "dflow-app-${version}.${ext}",
        asar: true,
        publish: [
          {
            provider: 'github',
            owner: 'engkimbs',
            private: true,
          }
        ],
        win: {
          target: [
            {
              target: "nsis",
              arch: ["x64", "ia32"]
            }
          ],
          icon: 'public/logo.png'
        },
        nsis: {
          "oneClick": false,
          "allowToChangeInstallationDirectory": true,
          "createDesktopShortcut": true
        }
      },
      preload: "src/preload.js"
    }
  },

  pages: {
    index: 'src/main.js',
    login: 'src/login/main.js'
  },

  transpileDependencies: [
    'vuetify'
  ]
};
