export default {
  pages: [{
    title: '',
    description: '',
    template: 'index.ejs',
    data: {
      experience: {
        title: 'Work experience',
        entries: [{
          title: 'Productive',
          location: 'Zagreb, Croatia',
          timeframe: '2018 – Present',
          description: 'Working as a JavaScript engineer on SaaS product based on',
          technologies: [{
            icon: 'ember',
            label: 'Ember.js'
          }, {
            icon: 'electron',
            label: 'Electron.js'
          }, {
            icon: 'wordpress',
            label: 'WordPress'
          }]
        }, {
          title: 'Infinum',
          location: 'Zagreb, Croatia',
          timeframe: '2015 – 2018',
          description: 'Working as a JavaScript engineer on agency projects based on',
          technologies: [{
            icon: 'js',
            label: 'Vanilla JS'
          }, {
            icon: 'vue',
            label: 'Vue.js'
          }, {
            icon: 'ember',
            label: 'Ember.js'
          }]
        }]
      },
      education: {
        title: 'Education',
        entries: [{
          title: 'University of Zagreb',
          location: 'Zagreb, Croatia',
          entries: [{
            title: 'MSc in Computing',
            timeframe: '2017–2019',
            description: 'Thesis topic: <a href="/petrusa_thesis_time_entry_prediction.pdf" target="_blank" rel="noopener"> Time entry prediction for a time tracking software </a>'
          }, {
            title: 'BSc in Computing',
            timeframe: '2014–2017',
            description: 'Thesis topic: <a href="/petrusa_thesis_react_native.pdf" target="_blank" rel="noopener"> React Native application for test quizes </a>'
          }]
        }, {
          title: 'XV. gimnazija',
          location: 'Zagreb, Croatia',
          entries: [{
            title: 'Competing at <a href="https://www.iypt.org/" target="_blank" rel="noopener"> IYPT </a>'
          }]
        }]
      },
      interests: {
        title: 'Interests',
        entries: ['Cooking', 'DIY', 'Sustainability', 'Machine learning']
      }
    }
  }]
}
