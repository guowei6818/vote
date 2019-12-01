/*
 * @Author: your name
 * @Date: 2019-11-19 09:59:01
 * @LastEditTime: 2019-11-19 10:00:19
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vote\vue.config.js
 */
module.exports = {
    configureWebpack: {
        performance: {
          hints:false
        },
        performance: {
            hints:'warning',
            maxEntrypointSize: 50000000,
            maxAssetSize: 30000000,
            assetFilter: function(assetFilename) {
                return assetFilename.endsWith('.js');
            }
        }
    }
}