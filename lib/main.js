'use babel';
var provider = require('./provider');

module.exports = {
  config: {
    path: {
      type: 'string',
      title: 'Path',
      default: '/Users/jamesvorderbruggen/Documents/features/gherkin.json',
      description: 'This is the relative path (from your project root) to your projects gherkin recommendations.'
    }
  },
  activate: function() {
    return provider.load();
  },
  getProvider: function() {
    return provider;
  }
};
