import {promisify} from 'util';
import {readFileSync} from 'fs';
import ejs from 'ejs';
import glob from 'glob'; // Match files using the patterns the shell uses, like stars and stuff

function getFileFromBundle(fileName, bundle) {
  const fileKeyWithName = Object.keys(bundle).find((key) => bundle[key].name === fileName)
  return bundle[fileKeyWithName];
}

export default function createHTMLPlugin() {
  return {
    name: 'create-html-plugin',
    async buildStart() {
      const templateFiles = await promisify(glob)('src/templates/**/*.ejs')
      const svgFiles = await promisify(glob)('src/templates/svgs/**/*.svg')
      templateFiles.concat(svgFiles).forEach((filePath) => {
        this.addWatchFile(filePath);
      });
    },
    async generateBundle(options, bundle) {
      const template = readFileSync('src/index.ejs', {encoding: 'utf-8'});
      const html = ejs.render(template, {
        mainJS: getFileFromBundle('index', bundle).fileName,
        mainCSS: bundle['bundle.css'].fileName
      }, {
        root: 'src/templates/'
      });

      bundle['index.html'] = {
        fileName: 'index.html', isAsset: true, source: html
      }
    }
  }
}
