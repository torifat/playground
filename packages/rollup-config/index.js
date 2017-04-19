import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/index.js',
  dest: 'dist/bundle.js',
  format: 'cjs',
  sourceMap: true,
  external: 'babel-runtime/regenerator',
  // https://github.com/rollup/rollup/wiki/JavaScript-API#exports
  exports: 'named',
  plugins: [
    resolve({ jsnext: true, main: true }),
    commonjs(),
    babel({ exclude: 'node_modules/**' })
  ]
};
