import postcss from 'rollup-plugin-postcss';
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
    createHTMLPlugin()
  ]
};
