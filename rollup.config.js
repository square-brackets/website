import postcss from 'rollup-plugin-postcss';
import copy from 'rollup-plugin-copy-assets';
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
      assets: [
        'src/assets'
      ],
    })
  ]
};
