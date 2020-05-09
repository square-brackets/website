import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy';
import createHTMLPlugin from './rollup-plugins/create-html';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    postcss({
      extract: true
    }),
    createHTMLPlugin(),
    copy({
      targets: [
        { src: 'src/assets/**/*', dest: 'dist/assets' },
        { src: 'src/public/**/*', dest: 'dist' }
      ]
    })
  ]
};
