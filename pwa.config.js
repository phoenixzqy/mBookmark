exports.workbox = {
  advanced: false, // alias
  injectManifest: false, // alias
  swSrc: 'service-worker.js', // template; mode: InjectManifest
  navigateFallbackWhitelist: [/^(?!\/__).*/], // mode: GenerateSW
  navigateFallback: '/pwanything/app.html', // mode: GenerateSW
  swDest: 'sw.js',
  exclude: [
    /\.git/,
    /\.map$/,
    /\.DS_Store/,
    /^manifest.*\.js(?:on)?$/,
    /\.gz(ip)?$/,
    /\.br$/
  ]
}


// Update Webpack config; ENV-dependent
exports.webpack = function (config, env) {
  let { production } = env;
  if (production) {
    config.output.publicPath = "/pwanything/"
  } else {
    config.devServer.https = true;
  }
};
