process.env.VUE_APP_VERSION = process.env.npm_package_version

module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                publish: [
                    {
                        provider: 'github',
                        owner: 'engkimbs',
                        private: true,
                    }
                ]
            },
            preload: "src/preload.js"
        }
    }
};
