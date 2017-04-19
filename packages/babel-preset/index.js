module.exports = {
  presets: [
    [
      'env',
      {
        modules: process.env.NODE_ENV === 'test' ? 'commonjs' : false
      }
    ]
  ],
  plugins: [
    process.env.NODE_ENV === 'test' ? undefined : 'external-helpers',
    'transform-regenerator',
    'transform-flow-strip-types',
    [
      'babel-plugin-transform-runtime',
      {
        helpers: false,
        polyfill: false,
        regenerator: true
      }
    ]
  ].filter(_ => _)
};
